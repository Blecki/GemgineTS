import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Engine } from "./Engine.js";
import { GameTime } from "./GameTime.js";

export class RenderComponent extends Component {
  public render(context: RenderingContext) {}
}

export class DebugGizmoComponent extends Component {  
  public render(context: RenderingContext) {
    context.context.globalAlpha = 0.5;
    context.context.globalCompositeOperation = "source-over";
    context.drawRectangle(this.parent.globalBounds, 'red');
  }
}

export class RenderModule extends Module {
  private renderables: RenderComponent[] = [];
  private debugGizmos: DebugGizmoComponent[] = [];
  public camera: Camera;
  public fpsQueue: number[];

  constructor() {
    super();
    this.fpsQueue = [];
  }

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (component instanceof RenderComponent) {
        this.renderables.push(component);
      }

      if (component instanceof DebugGizmoComponent) {
        this.debugGizmos.push(component);
      }
    });
  }

  update() {
  }

  render(engine: Engine, context: RenderingContext) {
    context.context.globalAlpha = 1;
    context.context.globalCompositeOperation = 'source-over';
    for (var renderable of this.renderables)
      renderable.render(context);
    context.flush(this.camera);

    if (engine.debugMode) {
      for (var debugGizmo of this.debugGizmos)
        debugGizmo.render(context);
      context.flush(this.camera);
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