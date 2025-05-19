import { AssetReference } from "./AssetReference.js";
import { initializeFromJSON } from "./JsonConverter.js";
import { Engine } from "./Engine.js";
import { TiledTileset } from "./TiledTileset.js";
import pathCombine from "./PathCombine.js";
import { TiledObject  } from "./TiledObject.js";

export class TiledLayer {
  public data: number[];
  public draworder: string;
  public height: number;
  public id: number;
  public name: string;
  public objects: TiledObject[];
  public opacity: number;
  public type: string;
  public visible: boolean;
  public width: number;
  public x: number;
  public y: number;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.objects != undefined) {
      this.objects = this.objects.map(t => { let n = new TiledObject(); initializeFromJSON(t, n); return n; });
      this.objects.forEach(t => t.resolveDependencies(self, engine));
    }
  }
}

export class TiledInlineTileset {
  public firstgid: number;
  public source: string;
  public tilesetAsset: TiledTileset;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.tilesetAsset = engine.assetMap.get(pathCombine(self.directory(), this.source)).asset as TiledTileset;
  }
}

export class TiledTilemap {
  public compressionlevel: number;
  public height: number;
  public infinite: boolean;
  public layers: TiledLayer[];
  public nexlayerid: number;
  public nextobjectid: number;
  public orientation: string;
  public renderorder: string;
  public tiledversion: string;
  public tileheight: number;
  public tilesets: TiledInlineTileset[];
  public tilewidth: number;
  public type: string;
  public version: string;
  public width: number;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.tilesets = this.tilesets.map(t => { let n = new TiledInlineTileset(); initializeFromJSON(t, n); return n; });
    this.tilesets.forEach(t => t.resolveDependencies(self, engine));

    this.layers = this.layers.map(t => { let n = new TiledLayer(); initializeFromJSON(t,n); return n; });
    this.layers.forEach(t => t.resolveDependencies(self, engine));
  }
}
