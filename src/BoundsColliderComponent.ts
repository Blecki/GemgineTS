import { componentType } from "./Component.js";
import { Rect } from "./Rect.js";
import { Component } from "./Component.js";
import { type DebuggableObject } from "./Debugger.js";
import { type FluentElement, Fluent } from "./Fluent.js";

@componentType("BoundsCollider")
export class BoundsColliderComponent extends Component implements DebuggableObject {
  overlaps(rect: Rect): boolean {
    if (this.parent == null) return false;
    return this.parent.globalBounds.overlaps(rect);
  }

  public createDebugger(name: string): FluentElement {
    return (new Fluent).div()._append(name, ' - ', 'BoundsColliderComponent');
  }
  
}
