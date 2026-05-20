import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent, type FluentElement } from "../../Fluent.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { ComboBox } from "../../editor/ComboBox.js";
import { AssetStore } from "../../AssetStore.js";

export class BlendValueEditor extends ValueEditor {
  protected raw: string = "normal";
  protected comboBox: ComboBox;
  
  constructor(assetStore: AssetStore) {
    super(assetStore);
    this.comboBox = new ComboBox(new Rect(0,0,1,1), [
      "normal",
      "multiply",
      "screen",
      "overlay",
      "difference" ]);
  }

  draw(ctx: RenderTarget2D, editor: EditorContext, drawArea: Rect): void {
    this.comboBox.rect = drawArea;
    this.raw = this.comboBox.gui(editor, this.raw);
  }

  setValue(v: any): void { 
    this.raw = `${v}`;
  }

  getValue() : any {
    return this.raw;
  }
}