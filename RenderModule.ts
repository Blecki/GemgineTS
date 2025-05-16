import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";

export class RenderComponent extends Component {
  public render(context: RenderingContext) {}
}

export class RenderModule extends Module {
  private renderables: RenderComponent[] = [];
  public camera: Camera;

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (component instanceof RenderComponent) {
        var rc = component as RenderComponent;
        this.renderables.push(rc);
      }
    });
  }

  update() {
  }

  render(context: RenderingContext) {
    for (var renderable of this.renderables)
      renderable.render(context);
    context.flushSprites(this.camera);
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }
}