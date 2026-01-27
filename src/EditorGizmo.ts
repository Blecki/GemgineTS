import { EditorContext } from "./EditorContext.js";
import { Point } from "./Point.js";
import { RenderTarget } from "./RenderTarget.js";
import { Rect } from "./Rect.js";

export class EditorGizmo {
  public position: Point;

  constructor(position: Point) {
    this.position = position;
  }
  
  public get bounds(): Rect {
    return new Rect(this.position.x, this.position.y, 1, 1);
  }

  public draw(target: RenderTarget, context: EditorContext) : void { }
}