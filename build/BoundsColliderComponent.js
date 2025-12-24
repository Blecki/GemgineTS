var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { componentType } from "./Component.js";
import { Rect } from "./Rect.js";
import { Component } from "./Component.js";
import {} from "./Debugger.js";
import { Fluent } from "./Fluent.js";
let BoundsColliderComponent = class BoundsColliderComponent extends Component {
    overlaps(rect) {
        if (this.parent == null)
            return false;
        return this.parent.globalBounds.overlaps(rect);
    }
    createDebugger(name) {
        return (new Fluent).div()._append(name, ' - ', 'BoundsColliderComponent');
    }
};
BoundsColliderComponent = __decorate([
    componentType("BoundsCollider")
], BoundsColliderComponent);
export { BoundsColliderComponent };
//# sourceMappingURL=BoundsColliderComponent.js.map