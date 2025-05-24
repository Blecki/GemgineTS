import { Entity } from "./Entity.js";
import { Engine } from "./Engine.js";
import { TiledTemplate } from "./Tiled/TiledTemplate.js";
import { ComponentFactory } from "./ComponentFactory.js";

export function componentType(name: string) {
  return function(ctr: new (parent: Entity) => Component) {
    ComponentFactory.addComponentType(name, ctr);
  };
}

@componentType("Component")
export class Component {
  public parent: Entity;

  constructor(parent: Entity) {
    this.parent = parent;
  }

  public initialize(engine: Engine, template: TiledTemplate) { /* Default implementation */ }
}
