import { Point } from "./Point.js";
import { Component } from "./Component.js";

export class Entity {
  public ID: number;
  public parent: Entity;
  public position: Point = new Point(0, 0);
  public components: Component[];

  constructor(ID: number, parent: Entity) {
    this.ID = ID;
    this.parent = parent;
    this.components = [];
  }

  public getComponent<T>(t: new () => T): T | undefined {
    return this.components.find((component) => component instanceof t) as T;
}
}