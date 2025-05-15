import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";

export class RenderComponent extends Component {
  public Render(context: RenderingContext) {}
}

export class RenderModule extends Module {
  private renderables: RenderComponent[] = [];

  ComponentCreated(component: Component) {
    if (component instanceof RenderComponent) {
      var rc = component as RenderComponent;
      this.renderables.push(rc);
    }
  }

  Update() {
  }

  Render(context: RenderingContext) {
    for (var renderable of this.renderables)
      renderable.Render(context);
  }
}