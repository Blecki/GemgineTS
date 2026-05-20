import { Rect } from "../Rect.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { AssetStore } from "../AssetStore.js";

export class ValueEditor {
  public cachedValue: any;

  constructor(assetStore: AssetStore) {}

  getDimensions() : Point {
    return new Point(80, 30);
  }

  getValue() : any {
    return this.cachedValue;
  }

  setValue(v: any) {
    this.cachedValue = v;
  }

  serialize() : any {
    return this.getValue();
  }

  deserialize(v: any) {
    this.setValue(v);
  }

  draw(ctx: RenderTarget2D, editor: EditorContext, drawArea: Rect) {}
}
