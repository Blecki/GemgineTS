import { Component, componentType } from "./Component.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Engine } from "./Engine.js";
import { GameTime } from "./GameTime.js";
import { RenderLayers } from "./RenderLayers.js";

export class RenderComponent extends Component {
  public renderLayer: number = RenderLayers.Ground;
  public render(context: RenderingContext):void { /* Default implementation */ }
}

interface RenderableComponent {
  renderLayer: number;
  render(context: RenderingContext):void;
}

@componentType("DebugGizmo")
export class DebugGizmoComponent extends RenderComponent {  
  public render(context: RenderingContext): void {
    context.context.globalAlpha = 0.5;
    context.context.globalCompositeOperation = "source-over";
    context.drawRectangle(this.parent.globalBounds, 'red');
  }
}

export class RenderModule extends Module {
  private readonly renderables: RenderableComponent[] = [];
  public camera: Camera | null = null;
  public fpsQueue: number[];

  
  private isRenderable(object: any): object is RenderableComponent {
    return 'render' in object;
  }

  constructor() {
    super();
    this.fpsQueue = [];
  }

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (this.isRenderable(component)) {
        this.renderables.push(component);
      }
    });
  }

  render(engine: Engine, context: RenderingContext) {
    if (this.camera == null) return;

    context.context.globalAlpha = 1;
    context.context.globalCompositeOperation = 'source-over';

    for (let layer in RenderLayers) {
      let layerNum = Number(RenderLayers[layer]);
      if (!Number.isNaN(layerNum)) {
        for (let renderable of this.renderables) {
          if (renderable.renderLayer == layerNum) renderable.render(context);
        }
        context.flush(this.camera);
      }
    }

    this.fpsQueue.push(GameTime.getDeltaTime());
    if (this.fpsQueue.length > 200) this.fpsQueue.shift();
    let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
    context.context.fillStyle = 'black';
    context.context.textAlign = 'left';
    context.context.textBaseline = 'top';
    context.context.fillText(Math.round(1 / averageFrameTime).toString(), 5, 5);
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }
}