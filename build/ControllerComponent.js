var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AssetStore } from "./AssetStore.js";
import { Component, componentType } from "./Component.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { CollisionModule } from "./CollisionModule.js";
import { Point } from "./Point.js";
let ControllerComponent = class ControllerComponent extends Component {
    useGravity;
    constructor(prototype) {
        super(prototype);
        let p = prototype;
        this.useGravity = p?.useGravity ?? true;
    }
    velocity = new Point(0, 0);
    isGrounded = false;
    collisionModule = undefined;
    initialize(engine, template, prototypeAsset) {
    }
    awake(engine, modules) {
        this.collisionModule = modules.getModule(CollisionModule);
    }
    move(delta) {
        if (this.parent == undefined)
            return;
        if (this.collisionModule == undefined)
            return;
        while (delta.x != 0 || delta.y != 0) {
            if (Math.abs(delta.y) > Math.abs(delta.x)) {
                let direction = 0;
                if (Math.abs(delta.y) >= 1)
                    direction = delta.y > 0 ? 1 : -1;
                else
                    direction = delta.y;
                let destinationBounds = this.parent?.globalBounds.withOffset(new Point(0, direction));
                let overlaps = this.collisionModule.overlaps(destinationBounds).filter(e => e !== this.parent);
                if (overlaps.length == 0)
                    this.parent.localPosition.y += direction;
                delta.y -= direction;
            }
            else {
                let direction = 0;
                if (Math.abs(delta.x) >= 1)
                    direction = delta.x > 0 ? 1 : -1;
                else
                    direction = delta.x;
                let destinationBounds = this.parent?.globalBounds.withOffset(new Point(direction, 0));
                let overlaps = this.collisionModule.overlaps(destinationBounds).filter(e => e !== this.parent);
                if (overlaps.length == 0)
                    this.parent.localPosition.x += direction;
                delta.x -= direction;
            }
        }
    }
};
ControllerComponent = __decorate([
    componentType("Controller"),
    __metadata("design:paramtypes", [Object])
], ControllerComponent);
export { ControllerComponent };
//# sourceMappingURL=ControllerComponent.js.map