import { Component } from "./Component.js";
import { Module } from "./Module.js";
export class RenderComponent extends Component {
    render(context) { }
}
export class DebugGizmoComponent extends Component {
    render(context) {
        context.drawRectangle(this.parent.globalBounds, 'red');
    }
}
export class RenderModule extends Module {
    renderables = [];
    debugGizmos = [];
    camera;
    entityCreated(entity) {
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
    render(engine, context) {
        for (var renderable of this.renderables)
            renderable.render(context);
        context.flush(this.camera);
        if (engine.debugMode) {
            for (var debugGizmo of this.debugGizmos)
                debugGizmo.render(context);
            context.flush(this.camera);
        }
    }
    setCamera(camera) {
        this.camera = camera;
    }
}
//# sourceMappingURL=RenderModule.js.map