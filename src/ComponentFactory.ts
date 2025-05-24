import { Component } from "./Component.js";
import { initializeFromJSON } from "./JsonConverter.js";
import { Entity } from "./Entity.js";

export class ComponentFactory {
  private static typeMap: Map<string, new (parent: Entity) => Component>;

  private constructor() {}

  public static addComponentType(name: string, createFunctor:  new (parent: Entity) => Component): void {
    ComponentFactory.typeMap ??= new Map<string,  new (parent: Entity) => Component>;
    ComponentFactory.typeMap.set(name, createFunctor);
    console.log(name);
  }

  public static create(name: string, parent: Entity): Component {
    const Constructor = ComponentFactory.typeMap.get(name);
    if (Constructor)
      return new Constructor(parent);
    return new Component(parent);
  }

  public static createFromPrototype(prototype: any, parent: Entity): Component {
    let component = ComponentFactory.create(prototype.type, parent);
    initializeFromJSON(prototype, component);
    return component;
  }
}