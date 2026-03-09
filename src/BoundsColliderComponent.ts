import { componentType } from "./Component.js";
import { Rect } from "./Rect.js";
import { Component } from "./Component.js";
import { RenderContext } from "./RenderContext.js";
import { RenderLayers } from "./RenderLayers.js";

type BoundsColliderComponentPrototype = {
  collisionBounds: object;
}

@componentType("BoundsCollider")
export class BoundsColliderComponent extends Component {
  public collisionBounds: Rect;

  constructor(prototype?: object) {
    super(prototype);
    let p = prototype as BoundsColliderComponentPrototype;
    this.collisionBounds = new Rect(p?.collisionBounds);
  }
  
  public get globalBounds(): Rect {
    if (this.parent == null) return this.collisionBounds;
    let gp = this.parent.globalPosition;
    let pivot = this.parent.pivot;
    return new Rect(gp.x - pivot.x + this.collisionBounds.x, gp.y - pivot.y + this.collisionBounds.y, this.collisionBounds.width, this.collisionBounds.height);
  }

  overlaps(rect: Rect): boolean {
    return this.globalBounds.overlaps(rect);
  }

  public render(context: RenderContext): void {
    if (this.parent != null) {
      var ctx = context.getTarget(RenderLayers.ObjectsDiffuse);
      ctx.drawRectangle(this.globalBounds, 'rgba(255, 255, 0, 0.5)');
    }
  }  
}
