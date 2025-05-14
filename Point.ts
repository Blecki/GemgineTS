export class Point {
  public x: number;
  public y: number;

  public constructor(x: number, y: number)
  {
    this.x = x;
    this.y = y;
  }

  public Add(other: Point): Point {
    return new Point(this.x + other.x, this.y + other.y);
  }
}