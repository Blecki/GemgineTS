import { Component, componentType } from "./Component.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Engine } from "./Engine.js";
import { GameTime } from "./GameTime.js";
import { RenderLayers } from "./RenderLayers.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";

export class RenderComponent extends Component {
  public renderLayer: number = RenderLayers.Ground;
  public render(context: RenderingContext):void { /* Default implementation */ }
}

interface RenderableComponent {
  renderLayer: number;
  render(context: RenderingContext):void;
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
    this.renderLayer = RenderLayers.Overlay;
  }  
  public render(context: RenderingContext): void {
    if (this.parent != null) {
      context.drawRectangle(this.parent.globalBounds, 'rgba(255, 0, 0, 0.5)');
      if (this.point != null)
        context.drawImage(this.point, new Rect(0, 0, this.point.width, this.point.height), new Point(this.parent.globalPosition.x - 2, this.parent.globalPosition.y - 2));
    }
  }
}

export class RenderModule extends Module {
  private readonly renderables: RenderableComponent[] = [];
  private readonly animatables: AnimateableComponent[] = [];
  public camera: Camera | null = null;
  public fpsQueue: number[] = [];
  public destinationCanvas: HTMLCanvasElement;
  public destinationContext: CanvasRenderingContext2D;
  public diffuseContext: RenderingContext;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.destinationCanvas = canvas;
    let ctx = this.destinationCanvas.getContext('2d');
    if (ctx == null) throw new Error("Failed to get 2D context");
    this.destinationContext = ctx;
    this.destinationContext.imageSmoothingEnabled = false;

    this.diffuseContext = new RenderingContext(this.destinationCanvas.width, this.destinationCanvas.height);
  }
  
  private isRenderable(object: any): object is RenderableComponent {
    return 'render' in object;
  }

  private isAnimatable(object: any): object is AnimateableComponent {
    return 'animate' in object;
  }

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (this.isRenderable(component)) {
        this.renderables.push(component);
      }

      if (this.isAnimatable(component)) {
        this.animatables.push(component);
      }
    });
  }

  render(engine: Engine) {

    this.animatables.forEach(a => a.animate());

    this.diffuseContext.clearScreen();
    
    if (this.camera == null) return;

    this.diffuseContext.context.globalAlpha = 1;
    this.diffuseContext.context.globalCompositeOperation = 'source-over';

    for (let layer in RenderLayers) {
      let layerNum = Number(RenderLayers[layer]);
      if (!Number.isNaN(layerNum)) {
        for (let renderable of this.renderables) {
          if (renderable.renderLayer == layerNum) renderable.render(this.diffuseContext);
        }
      }
    }

    this.diffuseContext.flush(this.camera);

    this.fpsQueue.push(GameTime.getDeltaTime());
    if (this.fpsQueue.length > 200) this.fpsQueue.shift();
    

    // Final composition
    this.destinationContext.clearRect(0, 0, this.destinationCanvas.width, this.destinationCanvas.height);
    this.destinationContext.drawImage(this.diffuseContext.canvas, 0, 0);

    let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
    this.destinationContext.fillStyle = 'black';
    this.destinationContext.textAlign = 'left';
    this.destinationContext.textBaseline = 'top';
    this.destinationContext.fillText(Math.round(1 / averageFrameTime).toString(), 5, 5);
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }
}