import { Component } from "./Component.js";
import { Module } from "./Module.js";
export class RenderComponent extends Component {
    Render(context) { }
}
export class RenderModule extends Module {
    renderables = [];
    ComponentCreated(component) {
        if (component instanceof RenderComponent) {
            var rc = component;
            this.renderables.push(rc);
        }
    }
    Update() {
    }
    Render(context) {
        for (var renderable of this.renderables)
            renderable.Render(context);
    }
}
//# sourceMappingURL=RenderModule.js.map