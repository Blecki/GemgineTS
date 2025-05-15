import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { Rect } from "./Rect.js";
import pathCombine from "./PathCombine.js";

export class TiledTileset {
  public columns: number;
  public image: string;
  public imageheight: number;
  public imagewidth: number;
  public margin: number;
  public name: string;
  public spacing: number;
  public tilecount: number;
  public tiledversion: string;
  public tileheight: number;
  public tilewidth: number;
  public type: string;
  public version: string;
  public imageAsset: ImageBitmap;

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    this.imageAsset = engine.AssetMap.get(pathCombine(self.Directory(), this.image)).asset as ImageBitmap;
  }

  public GetTileRect(index: number): Rect {
    return new Rect((index % this.columns) * this.tilewidth, Math.floor(index / this.columns) * this.tileheight, this.tilewidth, this.tileheight);
  }
}