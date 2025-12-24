var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Engine } from "./Engine.js";
import { Component, componentType } from "./Component.js";
import { Input } from "./Input.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { GameTime } from "./GameTime.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { Entity } from "./Entity.js";
import { AssetReference } from "./AssetReference.js";
import { CollisionModule } from "./CollisionModule.js";
import { Point } from "./Point.js";
let ControllerComponent = class ControllerComponent extends Component {
    collisionModule = undefined;
    initialize(engine, template, prototypeAsset) {
        this.collisionModule = engine.getModule(CollisionModule);
    }
    move(delta) {
        if (this.parent != undefined) {
            if (this.collisionModule != undefined) {
                let destinationBounds = this.parent.globalBounds.withOffset(delta);
                let overlaps = this.collisionModule.overlaps(destinationBounds).filter(e => e !== this.parent);
                if (overlaps.length == 0) {
                    this.parent.localPosition.x += delta.x;
                    this.parent.localPosition.y += delta.y;
                }
            }
        }
    }
};
ControllerComponent = __decorate([
    componentType("Controller")
], ControllerComponent);
export { ControllerComponent };
//# sourceMappingURL=ControllerComponent.js.map