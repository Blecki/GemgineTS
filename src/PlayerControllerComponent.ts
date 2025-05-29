import { Engine } from "./Engine.js";
import { Component, componentType } from "./Component.js";
import { Input } from "./Input.js";
import { TiledTemplate } from "./Tiled/TiledTemplate.js";
import { GameTime } from "./GameTime.js";
import { SpriteComponent } from "./SpriteComponent.js";

@componentType("PlayerController")
export class PlayerControllerComponent extends Component {
  private input: Input | null = null;
  private readonly speed: number = 32;
  private sprite: SpriteComponent | undefined = undefined;

  public initialize(engine: Engine, template: TiledTemplate) {
    this.input = new Input();
    this.input.bind("KeyA", "west");
    this.input.bind("KeyW", "north");
    this.input.bind("KeyS", "south");
    this.input.bind("KeyD", "east");
    this.input.initialize();

    this.sprite = this.parent.getComponent(SpriteComponent);
  }

  public update() {

    if (this.input?.check("west")) {
      this.parent.localPosition.x -= (this.speed * GameTime.getDeltaTime());
      if (this.sprite != undefined) {
        this.sprite.facing = "west";
        this.sprite.playAnimation("walk", false);
      }
    }
    if (this.input?.check("north")) {
      this.parent.localPosition.y -= (this.speed * GameTime.getDeltaTime());
      if (this.sprite != undefined) {
        this.sprite.facing = "north";
        this.sprite.playAnimation("walk", false);
      }
    }
    if (this.input?.check("south")) {
      this.parent.localPosition.y += (this.speed * GameTime.getDeltaTime());
      if (this.sprite != undefined) {
        this.sprite.facing = "south";
        this.sprite.playAnimation("walk", false);
      }
    }
    if (this.input?.check("east")) {
      this.parent.localPosition.x += (this.speed * GameTime.getDeltaTime());
      if (this.sprite != undefined) {
        this.sprite.facing = "east";
        this.sprite.playAnimation("walk", false);
      }
    }

    this.input?.cleanup();
  }
}