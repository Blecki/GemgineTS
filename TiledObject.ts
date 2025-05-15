import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { InitializeFromJSON } from "./JsonConverter.js";
import pathCombine from "./PathCombine.js";

export class TiledProperty {
  public name: string;
  public type: string;
  public value: string;
}

export class TiledObject {
  public gid: number;
  public height: number;
  public id: number;
  public name: string;
  public properties: TiledProperty[];
  public rotation: number;
  public template: string;
  public type: string;
  public visible: boolean;
  public width: number;
  public x: number;
  public y: number;
  public templateAsset: AssetReference;

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    if (this.template != null && this.template != "")
      this.templateAsset = engine.AssetMap.get(pathCombine(self.Directory(), this.template));

    if (this.properties != undefined)
      this.properties = this.properties.map(t => { var n = new TiledProperty(); InitializeFromJSON(t, n); return n; });
  }
}
