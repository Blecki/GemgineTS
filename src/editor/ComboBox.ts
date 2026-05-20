import { Point } from "./../Point.js";
import { RenderTarget2D } from "./../RenderTarget2D.js";
import { Camera } from "./../Camera.js";
import { MouseHandler } from "./../MouseHandler.js";
import { Rect } from "./../Rect.js";
import { Fluent } from "../Fluent.js";
import { KeyboardHandler, type KeyState } from "../KeyboardHandler.js";
import { EditorContext } from "./EditorContext.js";

export class ComboBox {
  private open: boolean = false;
  public options: string[] = [];

  public rect: Rect;

  constructor(rect: Rect, options: string[]) {
    this.rect = rect;
    this.options = options;
  }

  public gui(ctx: EditorContext, value: string) : string {
    ctx.widget(this.rect, {text: value}).ifMouseDown(b => {
      this.open = !this.open;
      b.handled = true;
    });
    let y = this.rect.y + this.rect.height;
    if (this.open) {
      this.options.forEach(o => {
        ctx.widget(new Rect(this.rect.x, y, this.rect.width, this.rect.height), {text: o, text_color: o == value ? "#ff0000" : "#000000"}).ifMouseDown(b => {
          value = o;
          b.handled = true;
        });
        y += this.rect.height;
      });
    }
    return value;
  }
}