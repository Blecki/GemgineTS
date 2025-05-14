import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";

export class RenderComponent extends Component {
  public render(context: RenderingContext) {}
}
export class RenderModule extends Module {
  private renderables: RenderComponent[] = [];

  ComponentCreated(component: Component) {
    if (component instanceof RenderComponent) {
      this.renderables.push(component as RenderComponent);
    }
  }

  Update() {
  }

  Render(context: RenderingContext) {
    for (var renderable of this.renderables)
      renderable.render(context);
  }
}