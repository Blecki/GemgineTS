import { Point } from "./Point.js";
import { Component } from "./Component.js";
import { Rect } from "./Rect.js";
import { QuadTree } from "./QuadTree.js";
import { type DebuggableObject, PropertyGrid } from "./Debugger.js";
import { Fluent, type FluentElement } from "./Fluent.js";

type EntityPrototype = {
  pivot: Point;
  size: Point;
  name: string;
}



export class Entity implements DebuggableObject {
  public ID: number;
  public parent: Entity | null;
  public name: string = "unnamed";
  public storageNode: QuadTree | null = null;
  
  public localPosition: Point = new Point(0, 0);
  public get globalPosition(): Point {
    if (!this.parent) return this.localPosition;
    return this.parent.globalPosition.add(this.localPosition);
  }

  public get localBounds(): Rect {
    return new Rect(this.localPosition.x - this.pivot.x, this.localPosition.y - this.pivot.y, this.size.x, this.size.y);
  }

  public get globalBounds(): Rect {
    let gp = this.globalPosition;
    return new Rect(gp.x - this.pivot.x, gp.y - this.pivot.y, this.size.x, this.size.y);
  }
  
  public pivot: Point = new Point(0, 0);
  public size: Point = new Point(8, 8);

  public components: Component[];
  public children: Entity[];

  constructor(ID: number, prototype: object) {
    this.ID = ID;
    this.parent = null;
    this.components = [];
    this.children = [];

    let entityPrototype = prototype as EntityPrototype;
    this.pivot = entityPrototype?.pivot ?? new Point(0,0);
    this.size = entityPrototype?.size ?? new Point(8,8);
  }

  public addChild(other: Entity) {
    other.parent = this;
    this.children.push(other);
  }

  public getComponent<T>(t: new (parent: Entity) => T): T | undefined {
    var r = this.components.find((component) => component instanceof t);
    if (r == undefined) return undefined;
    return r as T;
  }

  public createDebugger(name: string): FluentElement {
    console.log("Trace: Entity.createDebugger");
    let grid = new PropertyGrid(this, name, ["ID", "name", "localPosition", "globalPosition", "pivot", "size", "components", "children"]);
    return grid.getElement();
  }
}