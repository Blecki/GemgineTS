import { Point } from "./Point.js";

export class Transform {
  public ID: number;
  public parent: Transform;
  public position: Point = new Point(0, 0);

  constructor(ID: number, parent: Transform) {
    this.ID = ID;
    this.parent = parent;
  }
}