import { Rect } from "../Rect.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { RenderTarget2D } from "../RenderTarget2D.js";

export class ValueEditor {
  public cachedValue: any;

  constructor() {}

  getDimensions() : Point {
    return new Point(80, 24);
  }

  getValue() : any {
    return this.cachedValue;
  }

  setValue(v: any) {
    this.cachedValue = v;
  }

  draw(ctx: RenderTarget2D, editor: EditorContext, drawArea: Rect) {}
}
