import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Engine } from "./Engine.js";

export class RenderComponent extends Component {
  public render(context: RenderingContext) {}
}

export class DebugGizmoComponent extends Component {  
  public render(context: RenderingContext) {
    context.drawRectangle(this.parent.globalBounds, 'red');
  }
}

export class RenderModule extends Module {
  private renderables: RenderComponent[] = [];
  private debugGizmos: DebugGizmoComponent[] = [];
  public camera: Camera;

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
    for (var renderable of this.renderables)
      renderable.render(context);
    context.flush(this.camera);

    if (engine.debugMode) {
      for (var debugGizmo of this.debugGizmos)
        debugGizmo.render(context);
      context.flush(this.camera);
    }
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }
}