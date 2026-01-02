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


type ControllerComponentPrototype = {
  useGravity: boolean;
}

@componentType("Controller")
export class ControllerComponent extends Component {
  public useGravity: boolean;

  constructor(prototype?:object) {
    super(prototype);
    let p = prototype as ControllerComponentPrototype;
    this.useGravity = p?.useGravity ?? true;
  }

  public velocity: Point = new Point(0, 0);
  public isGrounded: boolean = false;
  private collisionModule: CollisionModule | undefined = undefined;

  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference) {
    this.collisionModule = engine.getModule(CollisionModule);
  }

  public move(delta: Point): void {
    if (this.parent == undefined)
      return;
    if (this.collisionModule == undefined)
      return;

    while(delta.x != 0 || delta.y != 0) {
      if (Math.abs(delta.y) > Math.abs(delta.x)) {
        let direction = 0;
        if (Math.abs(delta.y) >= 1)
          direction = delta.y > 0 ? 1 : -1;
        else direction = delta.y;

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
        else direction = delta.x;

        let destinationBounds = this.parent?.globalBounds.withOffset(new Point(direction, 0));
        let overlaps = this.collisionModule.overlaps(destinationBounds).filter(e => e !== this.parent);
        if (overlaps.length == 0)
          this.parent.localPosition.x += direction;
        delta.x -= direction;
      }
    }
  }
}
