import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { GameTime } from "./GameTime.js";
export class RenderComponent extends Component {
    render(context) { }
}
export class DebugGizmoComponent extends Component {
    render(context) {
        context.context.globalAlpha = 0.5;
        context.context.globalCompositeOperation = "source-over";
        context.drawRectangle(this.parent.globalBounds, 'red');
    }
}
export class RenderModule extends Module {
    renderables = [];
    debugGizmos = [];
    camera;
    fpsQueue;
    constructor() {
        super();
        this.fpsQueue = [];
    }
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
        if (this.fpsQueue.length > 200)
            this.fpsQueue.shift();
        let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
        context.context.fillStyle = 'black';
        context.context.textAlign = 'left';
        context.context.textBaseline = 'top';
        context.context.fillText(Math.round(1 / averageFrameTime).toString(), 5, 5);
    }
    setCamera(camera) {
        this.camera = camera;
    }
}
//# sourceMappingURL=RenderModule.js.map