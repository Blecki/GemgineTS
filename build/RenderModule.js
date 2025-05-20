import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { GameTime } from "./GameTime.js";
export class RenderComponent extends Component {
    renderLayer;
    render(context) { }
}
export class DebugGizmoComponent extends RenderComponent {
    render(context) {
        context.context.globalAlpha = 0.5;
        context.context.globalCompositeOperation = "source-over";
        context.drawRectangle(this.parent.globalBounds, 'red');
    }
}
export class RenderModule extends Module {
    renderables = [];
    camera;
    fpsQueue;
    renderLayers;
    isRenderable(object) {
        return 'render' in object;
    }
    constructor(renderLayers) {
        super();
        this.fpsQueue = [];
        this.renderLayers = renderLayers;
    }
    entityCreated(entity) {
        entity.components.forEach(component => {
            if (this.isRenderable(component)) {
                this.renderables.push(component);
            }
        });
    }
    render(engine, context) {
        context.context.globalAlpha = 1;
        context.context.globalCompositeOperation = 'source-over';
        for (let layer = 0; layer < this.renderLayers.length; layer += 1) {
            for (let renderable of this.renderables)
                if (renderable.renderLayer == layer)
                    renderable.render(context);
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