import { Entity } from "./Entity.js";
import { AssetStore } from "./AssetStore.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { ComponentFactory } from "./ComponentFactory.js";
import { AssetReference } from "./AssetReference.js";
import { Modules } from "./Modules.js";

export function componentType(name: string) {
  return function(ctr: new (json:object) => Component) {
    ComponentFactory.addComponentType(name, ctr);
  };
}

export class Component {
  public parent: Entity | null = null;

  public constructor(prototype?:object) {}
  public initialize(engine: AssetStore, template: TiledTemplate, prototypeAsset: AssetReference) {}
  public awake(engine: AssetStore, modules: Modules) {}
}
