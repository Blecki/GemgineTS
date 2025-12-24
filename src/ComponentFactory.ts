import { Component } from "./Component.js";

export type ComponentBlueprint = {
  type: string;
}

export class ComponentFactory {
  private static typeMap: Map<string, new (prototype:ComponentBlueprint) => Component>;

  private constructor() {}

  public static addComponentType(name: string, createFunctor:  new (prototype:ComponentBlueprint) => Component): void {
    ComponentFactory.typeMap ??= new Map<string,  new (prototype:ComponentBlueprint) => Component>;
    ComponentFactory.typeMap.set(name, createFunctor);
  }

  public static create(name: string, prototype: ComponentBlueprint): Component {
    const Constructor = ComponentFactory.typeMap.get(name);
    if (Constructor)
      return new Constructor(prototype);
    console.log("Unknown component type: " + name);
    return new Component(prototype);
  }

  public static createFromBlueprint(prototype: ComponentBlueprint): Component {
    return ComponentFactory.create(prototype.type, prototype);
  }
}