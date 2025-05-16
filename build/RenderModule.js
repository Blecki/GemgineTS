import { Component } from "./Component.js";
import { Module } from "./Module.js";
export class RenderComponent extends Component {
    render(context) { }
}
export class RenderModule extends Module {
    renderables = [];
    camera;
    entityCreated(entity) {
        entity.components.forEach(component => {
            if (component instanceof RenderComponent) {
                var rc = component;
                this.renderables.push(rc);
            }
        });
    }
    update() {
    }
    render(context) {
        for (var renderable of this.renderables)
            renderable.render(context);
        context.flushSprites(this.camera);
    }
    setCamera(camera) {
        this.camera = camera;
    }
}
//# sourceMappingURL=RenderModule.js.map