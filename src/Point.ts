import { PropertyGrid, type DebuggableObject } from "./Debugger.js";
import type { FluentElement } from "./Fluent.js";

type PointPrototype = {
  x: number;
  y: number;
}

export class Point implements DebuggableObject {
  public x: number;
  public y: number;

  constructor(prototype: object);
  constructor(x: number, y: number);
  constructor(first: number | object, second?: number)
  {
    if (first === undefined) {
      this.x = 0;
      this.y = 0;
    }
    else if (typeof first === 'number') {
      this.x = first;
      this.y = second ?? 0;
    }
    else {
      let prototype = first as PointPrototype;
      this.x = prototype.x;
      this.y = prototype.y;
    }
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

  public truncate(): Point {
    return new Point(Math.floor(this.x), Math.floor(this.y));
  }
  
  public createDebugger(name: string): FluentElement {
    console.log("Trace: Entity.createDebugger");
    let grid = new PropertyGrid(this, name, ["x", "y"]);
    return grid.getElement();
  }
}