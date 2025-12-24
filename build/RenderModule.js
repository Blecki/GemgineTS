var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, componentType } from "./Component.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Engine } from "./Engine.js";
import { GameTime } from "./GameTime.js";
import { RenderLayers } from "./RenderLayers.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
export class RenderComponent extends Component {
    renderLayer = RenderLayers.Ground;
    render(context) { }
}
let DebugGizmoComponent = class DebugGizmoComponent extends RenderComponent {
    point = null;
    initialize(engine, template, prototypeAsset) {
        this.point = engine.getAsset("assets/point.png").asset;
        this.renderLayer = RenderLayers.Overlay;
    }
    render(context) {
        if (this.parent != null) {
            context.drawRectangle(this.parent.globalBounds, 'rgba(255, 0, 0, 0.5)');
            if (this.point != null)
                context.drawImage(this.point, new Rect(0, 0, this.point.width, this.point.height), new Point(this.parent.globalPosition.x - 2, this.parent.globalPosition.y - 2));
        }
    }
};
DebugGizmoComponent = __decorate([
    componentType("DebugGizmo")
], DebugGizmoComponent);
export { DebugGizmoComponent };
export class RenderModule extends Module {
    renderables = [];
    animatables = [];
    camera = null;
    fpsQueue = [];
    destinationCanvas;
    destinationContext;
    diffuseContext;
    constructor(canvas) {
        super();
        this.destinationCanvas = canvas;
        let ctx = this.destinationCanvas.getContext('2d');
        if (ctx == null)
            throw new Error("Failed to get 2D context");
        this.destinationContext = ctx;
        this.destinationContext.imageSmoothingEnabled = false;
        this.diffuseContext = new RenderingContext(this.destinationCanvas.width, this.destinationCanvas.height);
    }
    isRenderable(object) {
        return 'render' in object;
    }
    isAnimatable(object) {
        return 'animate' in object;
    }
    entityCreated(entity) {
        entity.components.forEach(component => {
            if (this.isRenderable(component)) {
                this.renderables.push(component);
            }
            if (this.isAnimatable(component)) {
                this.animatables.push(component);
            }
        });
    }
    render(engine) {
        this.animatables.forEach(a => a.animate());
        this.diffuseContext.clearScreen();
        if (this.camera == null)
            return;
        this.diffuseContext.context.globalAlpha = 1;
        this.diffuseContext.context.globalCompositeOperation = 'source-over';
        for (let layer in RenderLayers) {
            let layerNum = Number(RenderLayers[layer]);
            if (!Number.isNaN(layerNum)) {
                for (let renderable of this.renderables) {
                    if (renderable.renderLayer == layerNum)
                        renderable.render(this.diffuseContext);
                }
            }
        }
        this.diffuseContext.flush(this.camera);
        this.fpsQueue.push(GameTime.getDeltaTime());
        if (this.fpsQueue.length > 200)
            this.fpsQueue.shift();
        // Final composition
        this.destinationContext.clearRect(0, 0, this.destinationCanvas.width, this.destinationCanvas.height);
        this.destinationContext.drawImage(this.diffuseContext.canvas, 0, 0);
        let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
        this.destinationContext.fillStyle = 'black';
        this.destinationContext.textAlign = 'left';
        this.destinationContext.textBaseline = 'top';
        this.destinationContext.fillText(Math.round(1 / averageFrameTime).toString(), 5, 5);
    }
    setCamera(camera) {
        this.camera = camera;
    }
}
//# sourceMappingURL=RenderModule.js.map