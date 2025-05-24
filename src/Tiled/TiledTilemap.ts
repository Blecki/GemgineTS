import { AssetReference } from "../AssetReference.js";
import { initializeFromJSON } from "../JsonConverter.js";
import { Engine } from "../Engine.js";
import { TiledTileset } from "./TiledTileset.js";
import pathCombine from "../PathCombine.js";
import { TiledObject  } from "./TiledObject.js";

export class TiledLayer {
  public class: string | undefined = undefined;
  public data: number[] | undefined = undefined;
  public draworder: string | undefined = undefined;
  public height: number | undefined = undefined;
  public id: number | undefined = undefined;
  public name: string | undefined = undefined;
  public objects: TiledObject[] | undefined = undefined;
  public opacity: number | undefined = undefined;
  public type: string | undefined = undefined;
  public visible: boolean | undefined = undefined;
  public width: number | undefined = undefined;
  public x: number | undefined = undefined;
  public y: number | undefined = undefined;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.objects != undefined) {
      this.objects = this.objects.map(t => { let n = new TiledObject(); initializeFromJSON(t, n); return n; });
      this.objects.forEach(t => t.resolveDependencies(self, engine));
    }
  }
}

export class TiledInlineTileset {
  public firstgid: number | undefined = undefined;
  public source: string | undefined = undefined;
  public tilesetAsset: TiledTileset | undefined = undefined;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.source != undefined)
      this.tilesetAsset = engine.getAsset(pathCombine(self.directory(), this.source)).asset as TiledTileset;
  }
}

export class TiledTilemap {
  public compressionlevel: number | undefined = undefined;
  public height: number | undefined = undefined;
  public infinite: boolean | undefined = undefined;
  public layers: TiledLayer[] | undefined = undefined;
  public nexlayerid: number | undefined = undefined;
  public nextobjectid: number | undefined = undefined;
  public orientation: string | undefined = undefined;
  public renderorder: string | undefined = undefined;
  public tiledversion: string | undefined = undefined;
  public tileheight: number | undefined = undefined;
  public tilesets: TiledInlineTileset[] | undefined = undefined;
  public tilewidth: number | undefined = undefined;
  public type: string | undefined = undefined;
  public version: string | undefined = undefined;
  public width: number | undefined = undefined;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.tilesets = this.tilesets?.map(t => { let n = new TiledInlineTileset(); initializeFromJSON(t, n); return n; });
    this.tilesets?.forEach(t => t.resolveDependencies(self, engine));

    this.layers = this.layers?.map(t => { let n = new TiledLayer(); initializeFromJSON(t,n); return n; });
    this.layers?.forEach(t => t.resolveDependencies(self, engine));
  }
}
