var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { AssetStore } from "./AssetStore.js";
import { Component, componentType } from "./Component.js";
import { Input } from "./Input.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { GameTime } from "./GameTime.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { Entity } from "./Entity.js";
import { AssetReference } from "./AssetReference.js";
import { ControllerComponent } from "./ControllerComponent.js";
import { Point } from "./Point.js";
let FourWayPlayerControllerComponent = class FourWayPlayerControllerComponent extends Component {
    input = null;
    speed = 128;
    sprite = undefined;
    controller = undefined;
    facing = "south";
    playingStaticAnimation = false;
    initialize(engine, template, prototypeAsset) {
        this.input = new Input();
        this.input.bind("KeyA", "west");
        this.input.bind("KeyW", "north");
        this.input.bind("KeyS", "south");
        this.input.bind("KeyD", "east");
        this.input.bind("Space", "attack");
        this.input.initialize();
        this.sprite = this.parent?.getComponent(SpriteComponent);
        this.controller = this.parent?.getComponent(ControllerComponent);
    }
    update() {
        let delta = new Point(0, 0);
        if (!this.playingStaticAnimation) {
            if (this.input?.check("west")) {
                delta.x = -this.speed;
                this.facing = "west";
            }
            else if (this.input?.check("east")) {
                delta.x = this.speed;
                this.facing = "east";
            }
            if (this.input?.check("north")) {
                delta.y = -this.speed;
                this.facing = "north";
            }
            else if (this.input?.check("south")) {
                delta.y = this.speed;
                this.facing = "south";
            }
            if (this.input?.check("attack")) {
                this.input.markHandled("attack");
                this.playStatic("attack-" + this.facing);
            }
        }
        if (this.controller)
            this.controller.velocity = delta;
        if (this.sprite != undefined) {
            if (this.playingStaticAnimation) {
                if (this.sprite.isAnimationDone()) {
                    this.playingStaticAnimation = false;
                }
            }
            else {
                if (delta.x != 0 || delta.y != 0)
                    this.sprite?.playAnimation('run-' + this.facing, false);
                else
                    this.sprite?.playAnimation('idle-' + this.facing, false);
            }
        }
        this.input?.cleanup();
    }
    playStatic(anim) {
        this.sprite?.playAnimation(anim, true);
        this.playingStaticAnimation = true;
    }
};
FourWayPlayerControllerComponent = __decorate([
    componentType("FourWayPlayerController")
], FourWayPlayerControllerComponent);
export { FourWayPlayerControllerComponent };
//# sourceMappingURL=FourWayPlayerControllerComponent.js.map