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
import { ControllerComponent } from "./ControllerComponent.js";
import { Point } from "./Point.js";
let PlayerControllerComponent = class PlayerControllerComponent extends Component {
    input = null;
    speed = 128;
    sprite = undefined;
    controller = undefined;
    initialize(engine, template, prototypeAsset) {
        this.input = new Input();
        this.input.bind("KeyA", "west");
        this.input.bind("KeyW", "north");
        this.input.bind("KeyS", "south");
        this.input.bind("KeyD", "east");
        this.input.initialize();
        this.sprite = this.parent?.getComponent(SpriteComponent);
        this.controller = this.parent?.getComponent(ControllerComponent);
    }
    update() {
        let delta = new Point(0, 0);
        let aim = new Point(0, 0);
        if (this.controller?.isGrounded) {
            if (this.input?.check("west")) {
                delta.x = -this.speed;
                aim = new Point(-1, 0);
            }
            else if (this.input?.check("east")) {
                delta.x = this.speed;
                aim = new Point(1, 0);
            }
            this.controller.velocity.x = delta.x;
            if (this.input?.check("north")) {
                this.controller.velocity = new Point(this.controller.velocity.x, -256);
            }
        }
        if (this.sprite != undefined) {
            if (aim.x != 0)
                this.sprite.flip = (aim.x < 0);
            if (this.controller?.isGrounded) {
                if (delta.x != 0)
                    this.sprite?.playAnimation('run', false);
                else
                    this.sprite?.playAnimation('idle', false);
            }
            else {
                this.sprite.playAnimation('air', false);
            }
        }
        //this.controller?.move(delta.multiply(GameTime.getDeltaTime()));
        this.input?.cleanup();
    }
};
PlayerControllerComponent = __decorate([
    componentType("PlayerController")
], PlayerControllerComponent);
export { PlayerControllerComponent };
//# sourceMappingURL=PlayerControllerComponent.js.map