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

@componentType("PlayerController")
export class PlayerControllerComponent extends Component {
  private input: Input | null = null;
  private readonly speed: number = 128;
  private sprite: SpriteComponent | undefined = undefined;
  private controller: ControllerComponent | undefined = undefined;

  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference) {

    this.input = new Input();
    this.input.bind("KeyA", "west");
    this.input.bind("KeyW", "north");
    this.input.bind("KeyS", "south");
    this.input.bind("KeyD", "east");
    this.input.initialize();

    this.sprite = this.parent?.getComponent(SpriteComponent);
    this.controller = this.parent?.getComponent(ControllerComponent);
  }

  public update() {
    let delta = new Point(0,0);
    let aim = new Point(0,0);

    if (this.controller?.isGrounded) {
      if (this.input?.check("west")) {
        delta.x = -(this.speed * GameTime.getDeltaTime());
        aim = new Point(-1, 0);
      }      
      else if (this.input?.check("east")) {
        delta.x = (this.speed * GameTime.getDeltaTime());
        aim = new Point(1, 0);
      }
    }

    if (this.sprite != undefined) {
      if (aim.x != 0) 
        this.sprite.flip = (aim.x < 0);
      if (this.controller?.isGrounded) {
        if (delta.x != 0) this.sprite?.playAnimation('run', false);
        else this.sprite?.playAnimation('idle', false);
      }
    }

    this.controller?.move(delta);

    this.input?.cleanup();
  }
}