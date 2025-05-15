import { AssetReference } from "./AssetReference.js";
import { InitializeFromJSON } from "./JsonConverter.js";
import { Engine } from "./Engine.js";
import { Rect } from "./Rect.js";
import { TiledTileset } from "./TiledTileset.js";

export class TiledLayer {
  public data: number[];
  public height: number;
  public id: number;
  public name: string;
  public opacity: number;
  public type: string;
  public visible: boolean;
  public width: number;
  public x: number;
  public y: number;
}

export class TiledInlineTileset {
  public firstgid: number;
  public source: string;
  public tilesetAsset: TiledTileset;

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    this.tilesetAsset = engine.AssetMap.get(self.Directory() + this.source).asset as TiledTileset;
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
  }
}
