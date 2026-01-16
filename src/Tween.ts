import { GameTime } from "./GameTime.js";
import { Point } from "./Point.js";

export class TweenNumber {
  public readonly start: number;
  public readonly end: number;
  public readonly time: number;

  constructor (start: number, end: number, time: number) {
    this.start = start;
    this.end = end;
    this.time = time;
  }

  private progress: number = 0;

  public update() : number {
    this.progress += GameTime.getDeltaTime();
    return this.value;
  }

  public get value(): number {
    return this.start + ((this.end - this.start) * (this.progress / this.time));
  }
}

export class TweenPoint {
  public readonly start: Point;
  public readonly end: Point;
  public readonly time: number;

  constructor (start: Point, end: Point, time: number) {
    this.start = start;
    this.end = end;
    this.time = time;
  }

  private progress: number = 0;

  public update() : Point {
    this.progress += GameTime.getDeltaTime();
    return this.value;
  }

  public get value(): Point {
    let delta = this.end.sub(this.start);
    let t = this.progress / this.time;
    return this.start.add(delta.multiply(t));
  }
}