var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { componentType } from "./Component.js";
import { Rect } from "./Rect.js";
import { Component } from "./Component.js";
import {} from "./Debugger.js";
import { Fluent } from "./Fluent.js";
import { RenderContext } from "./RenderContext.js";
import { RenderLayers } from "./RenderLayers.js";
let BoundsColliderComponent = class BoundsColliderComponent extends Component {
    collisionBounds;
    constructor(prototype) {
        super(prototype);
        let p = prototype;
        this.collisionBounds = new Rect(p?.collisionBounds);
    }
    get globalBounds() {
        if (this.parent == null)
            return this.collisionBounds;
        let gp = this.parent.globalPosition;
        let pivot = this.parent.pivot;
        return new Rect(gp.x - pivot.x + this.collisionBounds.x, gp.y - pivot.y + this.collisionBounds.y, this.collisionBounds.width, this.collisionBounds.height);
    }
    overlaps(rect) {
        return this.globalBounds.overlaps(rect);
    }
    createDebugger(name) {
        return (new Fluent).div()._append(name, ' - ', 'BoundsColliderComponent');
    }
    render(context) {
        if (this.parent != null) {
            var ctx = context.getTarget(RenderLayers.ObjectsDiffuse);
            ctx.drawRectangle(this.globalBounds, 'rgba(255, 255, 0, 0.5)');
        }
    }
};
BoundsColliderComponent = __decorate([
    componentType("BoundsCollider"),
    __metadata("design:paramtypes", [Object])
], BoundsColliderComponent);
export { BoundsColliderComponent };
//# sourceMappingURL=BoundsColliderComponent.js.map