import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent, type FluentElement } from "../../Fluent.js";
import { Point } from "../../Point.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { Color } from "../../Color.js";

export class ColorValueEditor extends ValueEditor {
  protected rElement: FluentElement | null = null;
  protected gElement: FluentElement | null = null;
  protected bElement: FluentElement | null = null;
  protected aElement: FluentElement | null = null;

  constructor() {
    super();
    this.rElement = Fluent.input('number')._style({position: "absolute", width: "60px"});
    document.documentElement.appendChild(this.rElement);
    this.gElement = Fluent.input('number')._style({position: "absolute", width: "60px"});
    document.documentElement.appendChild(this.gElement);
    this.bElement = Fluent.input('number')._style({position: "absolute", width: "60px"});
    document.documentElement.appendChild(this.bElement);
    this.aElement = Fluent.input('number')._style({position: "absolute", width: "60px"});
    document.documentElement.appendChild(this.aElement);
  }

  getDimensions() : Point {
    return new Point(80, 48);
  }

  draw(ctx: RenderTarget2D, editor: EditorContext, drawArea: Rect): void {
    if (this.rElement) {
      let pos = editor.camera.worldPointToScreen(new Point(drawArea.x + 20, drawArea.y));
      this.rElement.style.left = pos.x.toString();
      this.rElement.style.top = pos.y.toString();
    }

    if (this.gElement) {
      let pos = editor.camera.worldPointToScreen(new Point(drawArea.x + 120, drawArea.y));
      this.gElement.style.left = pos.x.toString();
      this.gElement.style.top = pos.y.toString();
    }

    if (this.bElement) {
      let pos = editor.camera.worldPointToScreen(new Point(drawArea.x + 20, drawArea.y + 24));
      this.bElement.style.left = pos.x.toString();
      this.bElement.style.top = pos.y.toString();
    }

    if (this.aElement) {
      let pos = editor.camera.worldPointToScreen(new Point(drawArea.x + 120, drawArea.y + 24));
      this.aElement.style.left = pos.x.toString();
      this.aElement.style.top = pos.y.toString();
    }

    ctx.drawString("r", new Point(drawArea.x, drawArea.y), "#ffffff");
    ctx.drawString("g", new Point(drawArea.x + 100, drawArea.y), "#ffffff");
    ctx.drawString("b", new Point(drawArea.x, drawArea.y + 24), "#ffffff");
    ctx.drawString("a", new Point(drawArea.x + 100, drawArea.y + 24), "#ffffff");
    
  }

  setValue(v: any): void {
    if (this.rElement) this.rElement.value = v.r;
    if (this.gElement) this.gElement.value = v.g;
    if (this.bElement) this.bElement.value = v.b;
    if (this.aElement) this.aElement.value = v.a;
  }

  getValue() : any {
    let r = 0;
    let g = 0;
    let b = 0;
    let a = 0;
    if (this.rElement && this.rElement.value != "")
      r = Number(this.rElement.value);
    if (this.gElement && this.gElement.value != "")
      g = Number(this.gElement.value);
    if (this.bElement && this.bElement.value != "")
      b = Number(this.bElement.value);
    if (this.aElement && this.aElement.value != "")
      a = Number(this.aElement.value);
    return new Color(r,g,b,a);
  }
}