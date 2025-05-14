import { Component } from "./Component.js";
import { Module } from "./Module.js";
export class RenderComponent extends Component {
    render(context) { }
}
export class RenderModule extends Module {
    renderables = [];
    ComponentCreated(component) {
        if (component instanceof RenderComponent) {
            this.renderables.push(component);
        }
    }
    Update() {
    }
    Render(context) {
        for (var renderable of this.renderables)
            renderable.render(context);
    }
}
//# sourceMappingURL=RenderModule.js.map