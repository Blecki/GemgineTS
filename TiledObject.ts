import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { initializeFromJSON } from "./JsonConverter.js";
import pathCombine from "./PathCombine.js";
import { Point } from "./Point.js";

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
  public polygon: Point[];
  public properties: TiledProperty[];
  public rotation: number;
  public template: string;
  public type: string;
  public visible: boolean;
  public width: number;
  public x: number;
  public y: number;
  public templateAsset: AssetReference;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.template != null && this.template != "")
      this.templateAsset = engine.assetMap.get(pathCombine(self.directory(), this.template));

    if (this.properties != undefined)
      this.properties = this.properties.map(t => { let n = new TiledProperty(); initializeFromJSON(t, n); return n; });

    if (this.polygon != undefined)
      this.polygon = this.polygon.map(t => new Point(t.x, t.y));
  }
}
