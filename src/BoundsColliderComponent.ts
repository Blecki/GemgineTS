import { componentType } from "./Component.js";
import { Rect } from "./Rect.js";
import { Component } from "./Component.js";
import { type DebuggableObject } from "./Debugger.js";
import { type FluentElement, Fluent } from "./Fluent.js";
import { RenderContext } from "./RenderContext.js";
import { RenderLayers } from "./RenderLayers.js";

type BoundsColliderComponentPrototype = {
  collisionBounds: object;
}

@componentType("BoundsCollider")
export class BoundsColliderComponent extends Component implements DebuggableObject {
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

  public createDebugger(name: string): FluentElement {
    return (new Fluent).div()._append(name, ' - ', 'BoundsColliderComponent');
  }

  public render(context: RenderContext): void {
    if (this.parent != null) {
      var ctx = context.getTarget(RenderLayers.ObjectsDiffuse);
      ctx.drawRectangle(this.globalBounds, 'rgba(255, 255, 0, 0.5)');
    }
  }  
}
