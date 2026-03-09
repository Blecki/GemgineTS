import { Component } from "./Component.js";
import { componentType } from "./Component.js";
import { type FluentElement, Fluent } from "./Fluent.js";
import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import { Entity } from "./Entity.js";

export function loadScript(basePath: string, path: string): Promise<AssetReference> {
  return new Promise<AssetReference>(async (resolve, reject) => {
    const module = await import(basePath + path);
    resolve(new AssetReference(path, module));
  });
}

type ScriptComponentPrototype = {
  scriptPath: string;
}

export interface IScriptModule {
  update?: (entity: Entity) => void;
}

@componentType("Script")
export class ScriptComponent extends Component {
  public scriptPath: string;
  public scriptAsset: any = null;
  public scriptObject: any = null;

  constructor(prototype?: object) {
    super(prototype);
    let p = prototype as ScriptComponentPrototype;
    this.scriptPath = p?.scriptPath ?? "";
  }

  public resolveDependencies(reference: AssetReference, assets: AssetStore): void {  
    this.scriptAsset = assets.getPreloadedAsset(this.scriptPath).asset as IScriptModule;
  }

 
}