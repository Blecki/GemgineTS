import { Point } from "./Point.js";
import { Component } from "./Component.js";
import { Rect } from "./Rect.js";

export class Entity {
  public ID: number;
  public parent: Entity;

  public localPosition: Point = new Point(0, 0);
  public get globalPosition(): Point {
    if (!this.parent) return this.localPosition;
    return this.parent.globalPosition.add(this.localPosition);
  }

  public size: Point = new Point(1, 1);
  
  public get localBounds(): Rect {
    return new Rect(this.localPosition.x - this.pivot.x, this.localPosition.y - this.pivot.y, this.size.x, this.size.y);
  }

  public get globalBounds(): Rect {
    var gp = this.globalPosition;
    return new Rect(gp.x - this.pivot.x, gp.y - this.pivot.y, this.size.x, this.size.y);
  }
  
  public pivot: Point = new Point(0, 0);

  public components: Component[];
  public children: Entity[];

  constructor(ID: number) {
    this.ID = ID;
    this.parent = null;
    this.components = [];
    this.children = [];
  }

  public addChild(other: Entity) {
    other.parent = this;
    this.children.push(other);
  }

  public getComponent<T>(t: new () => T): T | undefined {
    return this.components.find((component) => component instanceof t) as T;
  }
}