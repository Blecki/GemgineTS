import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent, type FluentElement } from "../../Fluent.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";

export class NumberValueEditor extends ValueEditor {
  protected element: FluentElement | null = null;

  constructor() {
    super();
    this.element = Fluent.input('number')._style({position: "absolute", width: "80px"});
    document.documentElement.appendChild(this.element);
  }

  draw(ctx: RenderTarget2D, editor: EditorContext, drawArea: Rect): void {
    if (this.element) {
      let pos = editor.camera.worldPointToScreen(drawArea.origin);
      this.element.style.left = pos.x.toString();
      this.element.style.top = pos.y.toString();
    }
  }

  setValue(v: any): void {
    if (this.element) this.element.value = v;
  }

  getValue() : any {
    if (this.element && this.element.value != "")
      return Number(this.element.value);
    return 0;
  }
}