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

@componentType("FourWayPlayerController")
export class FourWayPlayerControllerComponent extends Component {
  private input: Input | null = null;
  private readonly speed: number = 128;
  private sprite: SpriteComponent | undefined = undefined;
  private controller: ControllerComponent | undefined = undefined;
  private facing: string = "south";
  private playingStaticAnimation: boolean = false;

  public initialize(engine: AssetStore, template: TiledTemplate, prototypeAsset: AssetReference) {

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

  public update() {
    let delta = new Point(0,0);

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
        if (delta.x != 0 || delta.y != 0) this.sprite?.playAnimation('run-' + this.facing, false);
        else this.sprite?.playAnimation('idle-' + this.facing, false);
      }
    }
        
    this.input?.cleanup();
  }

  private playStatic(anim: string) {
    this.sprite?.playAnimation(anim, true);
    this.playingStaticAnimation = true;
  }
}