import { AssetReference } from "./AssetReference.js";
import { InitializeFromJSON } from "./JsonConverter.js";
import { Engine } from "./Engine.js";
import { Rect } from "./Rect.js";
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

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    if (this.objects != undefined) {
      this.objects = this.objects.map(t => { var n = new TiledObject(); InitializeFromJSON(t, n); return n; });
      this.objects.forEach(t => t.ResolveDependencies(self, engine));
    }
  }
}

export class TiledInlineTileset {
  public firstgid: number;
  public source: string;
  public tilesetAsset: TiledTileset;

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    this.tilesetAsset = engine.AssetMap.get(pathCombine(self.Directory(), this.source)).asset as TiledTileset;
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

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    this.tilesets = this.tilesets.map(t => { var n = new TiledInlineTileset(); InitializeFromJSON(t, n); return n; });
    this.tilesets.forEach(t => t.ResolveDependencies(self, engine));

    this.layers = this.layers.map(t => { var n = new TiledLayer(); InitializeFromJSON(t,n); return n; });
    this.layers.forEach(t => t.ResolveDependencies(self, engine));
  }
}
