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
    this.x = center.x - (size.x / 2);
    this.y = center.y - (size.y / 2);
    this.width = size.x;
    this.height = size.y;
  }

  public overlaps(other: Rect): boolean {
    return (
        this.x < other.x + other.width &&
        this.x + this.width > other.x &&
        this.y < other.y + other.height &&
        this.y + this.height > other.y
    );
  }

  public get area(): number {
    return this.width * this.height;
  }
}