export class Point {
  public x: number;
  public y: number;

  public constructor(x: number, y: number)
  {
    this.x = x;
    this.y = y;
  }

  public copy(): Point {
    return new Point(this.x, this.y);
  }

  public add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }

  public negate(): Point {
    return new Point(-this.x, -this.y);
  }

  public sub(other: Point): Point {
    return new Point(this.x - other.x, this.y - other.y);
  }
}