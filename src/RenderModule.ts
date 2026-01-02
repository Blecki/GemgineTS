import { Component, componentType } from "./Component.js";
import { Module } from "./Module.js";
import { RenderContext } from "./RenderContext.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Engine } from "./Engine.js";
import { GameTime } from "./GameTime.js";
import { RenderLayers, RenderChannels } from "./RenderLayers.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { LightComponent } from "./LightComponent.js";
import { RawImage } from "./RawImage.js";
import { Vector3, v3sub, v3magnitudeSquared, v3dotProduct, v3normalize } from "./Vector3.js";
import { Color } from "./Color.js";

export class RenderComponent extends Component {
  public renderLayer: number = RenderLayers.Background;
  public renderChannel: number = RenderChannels.Diffuse;
  public render(context: RenderContext):void { /* Default implementation */ }
}

interface RenderableComponent {
  renderLayer: number;
  renderChannel: number;
  render(context: RenderContext):void;
}

interface AnimateableComponent {
  animate(): void;
}

@componentType("DebugGizmo")
export class DebugGizmoComponent extends RenderComponent {  
  private point: ImageBitmap | null = null;
  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference) 
  {
    this.point = engine.getAsset("assets/point.png").asset;
    this.renderLayer = RenderLayers.Objects;
    this.renderChannel = RenderChannels.Diffuse;
  }  
  public render(context: RenderContext): void {
    /*
    if (this.parent != null) {
      var ctx = context.getTarget(RenderLayers.Objects, RenderChannels.Diffuse);
      ctx.drawRectangle(this.parent.globalBounds, 'rgba(255, 0, 0, 0.5)');
      if (this.point != null)
        ctx.drawImage(this.point, new Rect(0, 0, this.point.width, this.point.height), new Point(this.parent.globalPosition.x - 2, this.parent.globalPosition.y - 2));
    }
    */
  }
}

class Light {
  public screenPosition: Point;
  public radius: number;
  public color: Color;
  public intensity: number;

  constructor(screenPosition: Point, radius: number, color: Color, intensity: number) {
    this.screenPosition = screenPosition;
    this.radius = radius;
    this.color = color;
    this.intensity = intensity;
  }
}

export class RenderModule extends Module {
  private readonly renderables: RenderableComponent[] = [];
  private readonly animatables: AnimateableComponent[] = [];
  private readonly lights: LightComponent[] = [];

  public camera: Camera | null = null;
  public fpsQueue: number[] = [];
  public destinationCanvas: HTMLCanvasElement;
  public destinationContext: CanvasRenderingContext2D;
  public renderContext: RenderContext;
  private compositeBuffer: RawImage;

  private readonly LightZ: number = 64;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.destinationCanvas = canvas;
    let ctx = this.destinationCanvas.getContext('2d', { willReadFrequently: true });
    if (ctx == null) throw new Error("Failed to get 2D context");
    this.destinationContext = ctx;
    this.destinationContext.imageSmoothingEnabled = false;

    this.renderContext = new RenderContext(this.destinationCanvas.width, this.destinationCanvas.height);
    this.compositeBuffer = new RawImage(new ImageData(this.destinationCanvas.width, this.destinationCanvas.height), this.destinationCanvas.width, this.destinationCanvas.height);
  }
  
  private isRenderable(object: any): object is RenderableComponent {
    return 'render' in object;
  }

  private isAnimatable(object: any): object is AnimateableComponent {
    return 'animate' in object;
  }

  private isLight(object: any): object is LightComponent {
    return 'offset' in object && 'radius' in object && 'color' in object && 'intensity' in object;
  }

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (this.isRenderable(component)) {
        this.renderables.push(component);
      }

      if (this.isAnimatable(component)) {
        this.animatables.push(component);
      }

      if (this.isLight(component)) {
        this.lights.push(component);
      }
    });
  }

  render(engine: Engine) {

    this.animatables.forEach(a => a.animate());

    this.renderContext.prepAll();
    
    if (this.camera == null) return;

        for (let renderable of this.renderables) {
          renderable.render(this.renderContext);
        }

    this.renderContext.flushAll(this.camera);

    this.fpsQueue.push(GameTime.getDeltaTime());
    if (this.fpsQueue.length > 200) this.fpsQueue.shift();    

    let localLights = this.lights.map(lc => {
      return new Light(
        (lc.parent?.globalPosition.add(lc.offset).add(this.camera?.drawOffset ?? new Point(0, 0))) ?? new Point(0, 0),
        lc.radius,
        lc.color,
        lc.intensity);
    });

    var backgroundDiffuse = this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Diffuse).asRawImage();
    var backgroundNormals = this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Normals).asRawImage();
    var objectDiffuse = this.renderContext.getTarget(RenderLayers.Objects, RenderChannels.Diffuse).asRawImage();
    var collisionDiffuse = this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Collision).asRawImage();

    this.compositeBuffer.shade((destX: number, destY: number, sourceU: number, sourceY: number) => {
      let lighting = {r: 0.1, g: 0.1, b: 0.1};
      let normal = backgroundNormals.sample(sourceU, sourceY, 'nearest');
      const surfaceNormal = { x: (2 * normal.r / 255) - 1, y: (2 * normal.g / 255) - 1, z: (2 * normal.b / 255) - 1 };
      let diffuse = backgroundDiffuse.sample(sourceU, sourceY, "nearest");
      let object = objectDiffuse.sample(sourceU, sourceY, "nearest");
      let collision = collisionDiffuse.sample(sourceU, sourceY, "nearest");
      let shadows = collision.r < 128;

      if (object.a < 128) {

        for (let light of localLights) {
          
          const distanceToLight = Math.sqrt((destX - light.screenPosition.x) ** 2 + (destY - light.screenPosition.y) ** 2);
          const lightDirection = { x: light.screenPosition.x - destX, y: light.screenPosition.y - destY, z: this.LightZ };
          
          if (shadows) {
            const halfLight = { x: lightDirection.x / 2, y: lightDirection.y / 2 };
            const objectIntersection = { x: halfLight.x + destX, y: halfLight.y + destY };
            const objectShadow = objectDiffuse.sample(objectIntersection.x / this.destinationCanvas.width, objectIntersection.y / this.destinationCanvas.height, "nearest");
            if (objectShadow.a > 128) continue;
          }

          const cosAngle = v3dotProduct(v3normalize(surfaceNormal), v3normalize(lightDirection));
          const lightIntensity = Math.max(0, 1 - distanceToLight / light.radius) * Math.max(0, cosAngle);
          const viewDirection = { x: 0, y: 0, z: 1 };
          const halfwayVector = v3normalize({ x: lightDirection.x + viewDirection.x, y: lightDirection.y + viewDirection.y, z: lightDirection.z + viewDirection.z });
          const shininess = 64; 
          const specularIntensity = Math.pow(Math.max(0, v3dotProduct(surfaceNormal, halfwayVector)), shininess);

          lighting.r +=  (lightIntensity + specularIntensity) * (light.color.r / 255) * light.intensity;
          lighting.g +=  (lightIntensity + specularIntensity) * (light.color.g / 255) * light.intensity;
          lighting.b +=  (lightIntensity + specularIntensity) * (light.color.b / 255) * light.intensity;
        }      

        return new Color(Math.round(diffuse.r * (Math.round(lighting.r / 0.25) * 0.25)),
                          Math.round(diffuse.g * (Math.round(lighting.g / 0.25) * 0.25)),
                          Math.round(diffuse.b * (Math.round(lighting.b / 0.25) * 0.25)),
                          255);
      }
      else 
      {
        for (let light of localLights) {
          
          const distanceToLight = Math.sqrt((destX - light.screenPosition.x) ** 2 + (destY - light.screenPosition.y) ** 2);
          const lightIntensity = Math.max(0, 1 - distanceToLight / light.radius);

          lighting.r +=  (lightIntensity) * (light.color.r / 255) * light.intensity;
          lighting.g +=  (lightIntensity) * (light.color.g / 255) * light.intensity;
          lighting.b +=  (lightIntensity) * (light.color.b / 255) * light.intensity;
        }      

        return new Color(Math.round(object.r * (Math.round(lighting.r / 0.25) * 0.25)),
                                  Math.round(object.g * (Math.round(lighting.g / 0.25) * 0.25)),
                                  Math.round(object.b * (Math.round(lighting.b / 0.25) * 0.25)),
                                  255);
      }

    }, new Rect(0, 0, this.compositeBuffer.width, this.compositeBuffer.height));

    // Final composition
    this.destinationContext.clearRect(0, 0, this.destinationCanvas.width, this.destinationCanvas.height);
    if (this.compositeBuffer.source != null)
      this.destinationContext.putImageData(this.compositeBuffer.source, 0, 0);

    let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
    this.destinationContext.fillStyle = 'white';
    this.destinationContext.strokeStyle = 'black';
    this.destinationContext.textAlign = 'left';
    this.destinationContext.textBaseline = 'top';
    let fps = Math.round(1 / averageFrameTime).toString();

    this.destinationContext.strokeText(fps, 5, 5);
    this.destinationContext.fillText(fps, 5, 5);
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }
}