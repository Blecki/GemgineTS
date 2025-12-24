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

@componentType("Controller")
export class ControllerComponent extends Component {
  private collisionModule: CollisionModule | undefined = undefined;

  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference) {
    this.collisionModule = engine.getModule(CollisionModule);
  }

  public move(delta: Point): void {
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
}
