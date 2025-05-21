import { Point } from "./Point.js";
import { Rect } from "./Rect.js";

export class Camera {
  public position: Point = new Point(0, 0);
  public bounds: Rect = new Rect(-0.5, -0.5, 1, 1);
}