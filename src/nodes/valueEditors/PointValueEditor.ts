import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent, type FluentElement } from "../../Fluent.js";
import { Point } from "../../Point.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";

export class PointValueEditor extends ValueEditor {
  protected rawX: string = "0";
  protected rawY: string = "0";

  draw(ctx: RenderTarget2D, editor: EditorContext, drawArea: Rect): void {
    this.rawX = editor.numberField(new Rect(drawArea.x + 20, drawArea.y, 60, 24), this.rawX);
    this.rawY = editor.numberField(new Rect(drawArea.x + 120, drawArea.y, 60, 24), this.rawY);

    ctx.drawString("x", new Point(drawArea.x, drawArea.y), "#ffffff");
    ctx.drawString("y", new Point(drawArea.x + 100, drawArea.y), "#ffffff");
  }

  setValue(v: any): void {
    this.rawX = `${v.x}`;
    this.rawY = `${v.y}`;
  }

  getValue() : any {
    let x = parseInt(this.rawX);
    let y = parseInt(this.rawY);
    return new Point(x,y);
  }

  deserialize(v: any) : void {
    this.setValue(new Point(v));
  }
}