import { Component } from "./Component.js";
import { componentType } from "./Component.js";
import { type DebuggableObject, PropertyGrid } from "./Debugger.js";
import { type FluentElement, Fluent } from "./Fluent.js";

type TagComponentPrototype = {
  tag: string;
}

@componentType("Tag")
export class TagComponent extends Component {
  public tag: string;

  constructor(prototype?: object) {
    super(prototype);
    let p = prototype as TagComponentPrototype;
    this.tag = p?.tag ?? "";
  }

  public createDebugger(name: string): FluentElement {
    let grid = new PropertyGrid(this, name, ["tag"]);
    return grid.getElement();
  }
}