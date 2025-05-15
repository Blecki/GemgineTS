import { Transform } from "./Transform.js";
import { Engine } from "./Engine.js";
import { TiledTemplate } from "./TiledTemplate.js";

export class Component {
  public typeName: string = "Component";
  
  public ID: number;
  public transform: Transform;

  public Initialize(engine: Engine, template: TiledTemplate) {}
}

export class ComponentFactory {
  private typeMap: Map<string, () => Component>;

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
    var component = this.create(prototype.type);
    for (var property in prototype) 
      component[property] = prototype[property];
    return component;
  }
}