import { Point } from "./Point.js";

export class Rect {
  public x: number;
  public y: number;
  public width: number;
  public height: number;

  public constructor(x: number, y: number, width: number, height: number)
  {
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
  }

  public set(center: Point, size: Point) {
    var x = center.x - (size.x / 2);
    var y = center.y - (size.y / 2);
    var width = size.x;
    var height = size.y;
  }
}