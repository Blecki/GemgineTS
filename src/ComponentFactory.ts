import { Component } from "./Component.js";

export class ComponentFactory {
  private static typeMap: Map<string, new () => Component>;

  private constructor() {}

  public static addComponentType(name: string, createFunctor:  new () => Component): void {
    ComponentFactory.typeMap ??= new Map<string,  new () => Component>;
    ComponentFactory.typeMap.set(name, createFunctor);
    console.log(name);
  }

  public static create(name: string): Component {
    const Constructor = ComponentFactory.typeMap.get(name);
    if (Constructor)
      return new Constructor();
    return new Component();
  }

  public static createFromPrototype(prototype): Component {
    let component = ComponentFactory.create(prototype.type);
    for (let property in prototype) 
      component[property] = prototype[property];
    return component;
  }
}