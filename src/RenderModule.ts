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
  public destinationContext: WebGLRenderingContext;
  public renderContext: RenderContext;
  private compositeBuffer: RawImage;
  private program: WebGLProgram | null;

  private readonly LightZ: number = 64;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.destinationCanvas = canvas;
    let ctx = this.destinationCanvas.getContext('webgl');
    if (ctx == null) throw new Error("Failed to get WebGL context");
    this.destinationContext = ctx;
    //this.destinationContext.imageSmoothingEnabled = false;

    this.renderContext = new RenderContext(this.destinationCanvas.width, this.destinationCanvas.height, this.destinationContext);
    this.compositeBuffer = new RawImage(new ImageData(this.destinationCanvas.width, this.destinationCanvas.height), this.destinationCanvas.width, this.destinationCanvas.height);

    const vertexShader = this.compileShader(this.destinationContext, `
        attribute vec4 a_position; // [-1, -1] to [1, 1]
        varying vec2 v_texcoord;   
        
        void main() {
          gl_Position = a_position;
          v_texcoord = (a_position.xy * 0.5) + 0.5;
          v_texcoord.y = 1.0 - v_texcoord.y;
        }
      `, this.destinationContext.VERTEX_SHADER);

    const fragmentShader = this.compileShader(this.destinationContext, `
      precision highp float;

      uniform sampler2D u_diffuse;
      uniform sampler2D u_objects;
      uniform sampler2D u_normals;
      uniform sampler2D u_collision;
      varying vec2 v_texcoord;

      const int MAX_LIGHTS = 5; 

      struct Light {
          vec2 position;
          float radius;
          vec3 color;
          float intensity;
      };

      uniform Light u_lights[MAX_LIGHTS];
      uniform int u_numActiveLights;

      void main() {
       
        float destx = 528.0 * v_texcoord.x;
        float desty = 224.0 * v_texcoord.y;

        vec3 lighting = vec3(0.1, 0.1, 0.1);
        vec4 object = texture2D(u_objects, v_texcoord);
        
        if (object.a > 0.5) 
        {
          for (int i = 0; i < MAX_LIGHTS; i++) 
          {
            if (i >= u_numActiveLights) break; 
            float distanceToLight = sqrt(
              ((destx - u_lights[i].position.x) * (destx - u_lights[i].position.x)) +
              ((desty - u_lights[i].position.y) * (desty - u_lights[i].position.y)) 
            );
            float lightIntensity = max(0.0, 1.0 - (distanceToLight / u_lights[i].radius));
            
            lighting = vec3(lighting.r + (lightIntensity * u_lights[i].color.r * u_lights[i].intensity),
                        lighting.g + (lightIntensity * u_lights[i].color.g * u_lights[i].intensity),
                        lighting.b + (lightIntensity * u_lights[i].color.b * u_lights[i].intensity));
          }      

          gl_FragColor = vec4(object.r * lighting.r, 
                          object.g * lighting.g,
                          object.b * lighting.b,
                          1.0);
        }
        else 
        {
          vec4 diffuse = texture2D(u_diffuse, v_texcoord);
          vec4 normal = texture2D(u_normals, v_texcoord);
          vec4 collision = texture2D(u_collision, v_texcoord);
          vec3 surfaceNormal = vec3((2.0 * normal.r) - 1.0, (2.0 * normal.g) - 1.0, (2.0 * normal.b) - 1.0);

          for (int i = 0; i < MAX_LIGHTS; i++) 
          {
            if (i >= u_numActiveLights) break; 
            float distanceToLight = sqrt(
              ((destx - u_lights[i].position.x) * (destx - u_lights[i].position.x)) +
              ((desty - u_lights[i].position.y) * (desty - u_lights[i].position.y)) 
            );
            vec3 lightDirection = vec3(u_lights[i].position.x - destx, u_lights[i].position.y - desty, 64.0);

            if (collision.r < 0.5) {
              vec2 halfLight = vec2(lightDirection.x / 2.0, lightDirection.y / 2.0);
              vec2 objectIntersection = vec2((halfLight.x + destx) / 528.0, (halfLight.y + desty) / 224.0);
              vec4 objectShadow = texture2D(u_objects, objectIntersection);
              if (objectShadow.a > 0.5) continue;
            }
            
            float cosAngle = dot(normalize(surfaceNormal), normalize(lightDirection));
            float lightIntensity = max(0.0, 1.0 - (distanceToLight / u_lights[i].radius)) * max(0.0, cosAngle);
            float shininess = 64.0; 
            float specularIntensity = min(lightIntensity, pow(max(0.0, cosAngle), shininess));

            lighting = vec3(
              lighting.r + ((lightIntensity + specularIntensity) * u_lights[i].color.r * u_lights[i].intensity),
              lighting.g + ((lightIntensity + specularIntensity) * u_lights[i].color.g * u_lights[i].intensity),
              lighting.b + ((lightIntensity + specularIntensity) * u_lights[i].color.b * u_lights[i].intensity));
          }      

          gl_FragColor = vec4( diffuse.r * (floor(lighting.r * 4.0) / 4.0), 
                               diffuse.g * (floor(lighting.g * 4.0) / 4.0),
                               diffuse.b * (floor(lighting.b * 4.0) / 4.0),
                               1.0);
        }
      }
    `, this.destinationContext.FRAGMENT_SHADER);

    this.program = this.compileProgram(this.destinationContext, vertexShader, fragmentShader);

    this.destinationContext.useProgram(this.program);

    const positionBuffer = this.destinationContext.createBuffer();
    this.destinationContext.bindBuffer(this.destinationContext.ARRAY_BUFFER, positionBuffer);

    const positions = new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      1.0, 1.0
    ]);
    this.destinationContext.bufferData(this.destinationContext.ARRAY_BUFFER, positions, this.destinationContext.STATIC_DRAW);

    if (this.program != null) {
    const positionLocation = this.destinationContext.getAttribLocation(this.program, "a_position");
    this.destinationContext.enableVertexAttribArray(positionLocation);
    this.destinationContext.vertexAttribPointer(positionLocation, 2, this.destinationContext.FLOAT, false, 0, 0);
    }
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

    this.fpsQueue.push(GameTime.getDeltaTime());
    if (this.fpsQueue.length > 200) this.fpsQueue.shift();
    var objectDiffuse = this.renderContext.getTarget(RenderLayers.Objects, RenderChannels.Diffuse);

    let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
    let fps = Math.round(1 / averageFrameTime).toString();
    objectDiffuse.drawString(fps, new Point(5, 5), 'white');

    this.renderContext.flushAll(this.camera);

    if (this.program != null) {
      var u_image0Location = this.destinationContext.getUniformLocation(this.program, "u_diffuse");
      this.destinationContext.uniform1i(u_image0Location, 0); 
      var u_image1Location = this.destinationContext.getUniformLocation(this.program, "u_objects");
      this.destinationContext.uniform1i(u_image1Location, 1); 
      var u_image2Location = this.destinationContext.getUniformLocation(this.program, "u_normals");
      this.destinationContext.uniform1i(u_image2Location, 2); 
      var u_image3Location = this.destinationContext.getUniformLocation(this.program, "u_collision");
      this.destinationContext.uniform1i(u_image3Location, 3); 
      var numActiveLightsLoc = this.destinationContext.getUniformLocation(this.program, "u_numActiveLights");


      this.destinationContext.clear(this.destinationContext.COLOR_BUFFER_BIT | this.destinationContext.DEPTH_BUFFER_BIT);
      var backgroundDiffuse = this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Diffuse);
      backgroundDiffuse.bind(this.destinationContext, this.destinationContext.TEXTURE0);
      objectDiffuse.bind(this.destinationContext, this.destinationContext.TEXTURE1);
      var backgroundNormals = this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Normals);
      backgroundNormals.bind(this.destinationContext, this.destinationContext.TEXTURE2);
      var collisionDiffuse = this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Collision);
      collisionDiffuse.bind(this.destinationContext, this.destinationContext.TEXTURE3);

      let localLights = this.lights.map(lc => {
        return new Light(
          (lc.parent?.globalPosition.add(lc.offset).add(this.camera?.drawOffset ?? new Point(0, 0))) ?? new Point(0, 0),
          lc.radius,
          lc.color,
          lc.intensity);
        });
      
      if (numActiveLightsLoc != null) {
        this.destinationContext.uniform1i(numActiveLightsLoc, localLights.length);
        for (let i = 0; i < localLights.length; i++) {
            this.destinationContext.uniform2fv(this.destinationContext.getUniformLocation(this.program, `u_lights[${i}].position`), new Float32Array([localLights[i].screenPosition.x, localLights[i].screenPosition.y]));
            this.destinationContext.uniform3fv(this.destinationContext.getUniformLocation(this.program, `u_lights[${i}].color`), new Float32Array([localLights[i].color.r / 255, localLights[i].color.g / 255, localLights[i].color.b / 255]));
            this.destinationContext.uniform1f(this.destinationContext.getUniformLocation(this.program, `u_lights[${i}].radius`), localLights[i].radius);
            this.destinationContext.uniform1f(this.destinationContext.getUniformLocation(this.program, `u_lights[${i}].intensity`), localLights[i].intensity);
        }
      }

      this.destinationContext.drawArrays(this.destinationContext.TRIANGLE_STRIP, 0, 4);

    }
    /*
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
    */
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  compileShader(context: WebGLRenderingContext, text: string, type: number) : WebGLShader | null{
    const shader = context.createShader(type);
    if (shader == null) return null;
    context.shaderSource(shader, text);
    context.compileShader(shader);

    if (!context.getShaderParameter(shader, context.COMPILE_STATUS)) {
      throw new Error(`Failed to compile shader: ${context.getShaderInfoLog(shader)}`);
    }
    return shader;
  }

  compileProgram(context: WebGLRenderingContext, vertexShader: WebGLShader | null, fragmentShader: WebGLShader | null): WebGLProgram | null{
    const program = context.createProgram();
    if (vertexShader != null) context.attachShader(program, vertexShader);
    if (fragmentShader != null) context.attachShader(program, fragmentShader);
    context.linkProgram(program);

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      throw new Error(`Failed to compile WebGL program: ${context.getProgramInfoLog(program)}`);
    }

    return program;
  }
}