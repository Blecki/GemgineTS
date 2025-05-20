import { Entity } from "./Entity.js";
import { Engine } from "./Engine.js";
import { TiledTemplate } from "./Tiled/TiledTemplate.js";

export class Component {
  public parent: Entity;

  public initialize(engine: Engine, template: TiledTemplate) {}
}

export class ComponentFactory {
  private readonly typeMap: Map<string, () => Component>;

  constructor() {
    this.typeMap = new Map<string, () => Component>;
    this.addComponentType("Component", () => new Component());
  }

  addComponentType(name: string, createFunctor: () => Component) {
    this.typeMap.set(name, createFunctor);
  }

  create(name: string) {
    if (this.typeMap.get(name) != undefined)
      return this.typeMap.get(name)();
    return new Component();
  }

  createFromPrototype(prototype) {
    let component = this.create(prototype.type);
    for (let property in prototype) 
      component[property] = prototype[property];
    return component;
  }
}