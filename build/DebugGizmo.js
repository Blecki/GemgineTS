var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { componentType } from "./Component.js";
import { RenderComponent } from "./RenderModule.js";
import { RenderContext } from "./RenderContext.js";
import { AssetStore } from "./AssetStore.js";
import { RenderLayers } from "./RenderLayers.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
let DebugGizmoComponent = class DebugGizmoComponent extends RenderComponent {
    point = null;
    initialize(engine, template, prototypeAsset) {
        this.point = engine.getPreloadedAsset("assets/point.png").asset;
        this.renderLayer = RenderLayers.ObjectsDiffuse;
    }
    render(context) {
        if (this.parent != null) {
            var ctx = context.getTarget(RenderLayers.ObjectsDiffuse);
            ctx.drawRectangle(this.parent.globalBounds, 'rgba(255, 0, 0, 0.5)');
            if (this.point != null)
                ctx.drawImage(this.point, new Rect(0, 0, this.point.width, this.point.height), new Point(this.parent.globalPosition.x - 2, this.parent.globalPosition.y - 2));
        }
    }
};
DebugGizmoComponent = __decorate([
    componentType("DebugGizmo")
], DebugGizmoComponent);
export { DebugGizmoComponent };
//# sourceMappingURL=DebugGizmo.js.map