import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent, type FluentElement } from "../../Fluent.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { AssetStore } from "../../AssetStore.js";

export class NumberValueEditor extends ValueEditor {
  protected raw: string = "0";

  constructor(assetStore: AssetStore) {
    super(assetStore);
  }

  draw(ctx: RenderTarget2D, editor: EditorContext, drawArea: Rect): void {
    this.raw = editor.numberField(new Rect(drawArea.x + 20, drawArea.y, 60, 24), this.raw);
  }

  setValue(v: any): void {
    this.raw = `${v}`;
  }

  getValue() : any {
    return parseInt(this.raw);
  }
}