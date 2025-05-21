import { Entity } from "./Entity.js";
import { Engine } from "./Engine.js";
import { TiledTemplate } from "./Tiled/TiledTemplate.js";
import { ComponentFactory } from "./ComponentFactory.js";

export function componentType(name: string) {
  return function(ctr: new () => Component) {
    ComponentFactory.addComponentType(name, ctr);
  };
}

@componentType("Component")
export class Component {
  public parent: Entity;

  public initialize(engine: Engine, template: TiledTemplate) { /* Default implementation */ }
}
