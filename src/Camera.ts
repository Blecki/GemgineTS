import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { GameTime } from "./GameTime.js";

export class Camera {
  public position: Point = new Point(0, 0);
  public drawOffset: Point = new Point(0,0);
  public panSpeed: number = 512.0;
  public canvasSize: Point;
  public realPosition: Point = new Point(0, 0);

  constructor(canvasSize: Point) {
    this.canvasSize = canvasSize;
  }

  public update() : void {
    let delta = this.position.sub(this.realPosition);
    let step = this.panSpeed * GameTime.getDeltaTime();
    console.log(delta);
    if (delta.length() <= step)
      this.realPosition = this.position;
    else 
      this.realPosition = this.realPosition.add(delta.normalized().multiply(step));
    let halfOffset = new Point(this.canvasSize.x / 2, this.canvasSize.y / 2);
    this.drawOffset = this.realPosition.negate().add(halfOffset).truncate();
  }

  public moveCameraSmooth(to: Point) {
    this.position = to;
  }

  public moveCameraTeleport(to: Point) {
    this.realPosition = to;
    this.position = to;
  }

  public confineToVisibleBounds(bounds: Rect, screenSize: Point) {
    let boundsCenter = new Point(bounds.x + (bounds.width / 2), bounds.y + (bounds.height / 2));
    let allowedDeviation = new Point(bounds.width - screenSize.x, bounds.height - screenSize.y);
    let newBounds = new Rect(boundsCenter.x - (allowedDeviation.x / 2), boundsCenter.y - (allowedDeviation.y / 2), 
      allowedDeviation.x, allowedDeviation.y);
    this.confineToBounds(newBounds);
  }

  public confineToBounds(bounds: Rect) {
    let pos = new Point(this.position);
    if (pos.x < bounds.x) pos.x = bounds.x;
    if (pos.x >= bounds.x + bounds.width) pos.x = bounds.x + bounds.width;
    if (pos.y < bounds.y) pos.y = bounds.y;
    if (pos.y >= bounds.y + bounds.height) pos.y = bounds.y + bounds.height;
    this.moveCameraSmooth(pos);
  }
}