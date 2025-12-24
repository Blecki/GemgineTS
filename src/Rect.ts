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
  
  static enumerate(rect: Rect, callback: (x: number, y: number) => void): void {
    for (let y = rect.y; y < rect.y + rect.height; y++) {
          for (let x = rect.x; x < rect.x + rect.width; x++) {
              callback(x, y);
          }
      }
  }

  static getRelativeDirection(a: Rect, b: Rect): string {
    if (b.x >= a.x + a.width) return "east";
    if (b.x + b.width <= a.x) return "west";
    if (b.y >= a.y + a.height) return "south";
    if (b.y + b.height <= a.y) return "north";
    return "huh?";
  }

  public withOffset(point: Point): Rect {
    return new Rect(this.x + point.x, this.y + point.y, this.width, this.height);
  }
}