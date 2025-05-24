import { AssetReference } from "../AssetReference.js";
import { Engine } from "../Engine.js";
import { initializeFromJSON } from "../JsonConverter.js";
import pathCombine from "../PathCombine.js";
import { Point } from "../Point.js";

export class TiledProperty {
  public name: string | undefined = undefined;
  public type: string | undefined = undefined;
  public value: string | undefined = undefined;
}

export class TiledObject {
  public gid: number | undefined = undefined;
  public height: number | undefined = undefined;
  public id: number | undefined = undefined;
  public name: string | undefined = undefined;
  public polygon: Point[] | undefined = undefined;
  public properties: TiledProperty[] | undefined = undefined;
  public rotation: number | undefined = undefined;
  public template: string | undefined = undefined;
  public type: string | undefined = undefined;
  public visible: boolean | undefined = undefined;
  public width: number | undefined = undefined;
  public x: number | undefined = undefined;
  public y: number | undefined = undefined;
  public templateAsset: AssetReference | undefined = undefined;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.template != null && this.template != "")
      this.templateAsset = engine.assetMap.get(pathCombine(self.directory(), this.template));

    if (this.properties != undefined)
      this.properties = this.properties.map(t => { let n = new TiledProperty(); initializeFromJSON(t, n); return n; });

    if (this.polygon != undefined)
      this.polygon = this.polygon.map(t => new Point(t.x, t.y));
  }
}
