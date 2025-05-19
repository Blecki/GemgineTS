import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { Rect } from "./Rect.js";
import pathCombine from "./PathCombine.js";
import { initializeFromJSON } from "./JsonConverter.js";
import { TiledObject } from "./TiledObject.js";

export class TiledObjectGroup {
  public draworder: string;
  public id: number;
  public name: string;
  public objects: TiledObject[];
  public opacity: number;
  public type: string;
  public visible: boolean;
  public x: number;
  public y: number;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.objects != undefined) {
      this.objects = this.objects.map(t => { let n = new TiledObject(); initializeFromJSON(t, n); return n; });
      this.objects.forEach(t => t.resolveDependencies(self, engine));
    }
  }
}

export class TiledTile {
  public id: number;
  public objectgroup: TiledObjectGroup;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.objectgroup != undefined) {
      let n = new TiledObjectGroup();
      initializeFromJSON(this.objectgroup, n);
      this.objectgroup = n;
    }
  }
}

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
  public tiles: TiledTile[];
  public tilewidth: number;
  public type: string;
  public version: string;
  public imageAsset: ImageBitmap;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.imageAsset = engine.assetMap.get(pathCombine(self.directory(), this.image)).asset as ImageBitmap;
    if (this.tiles != undefined) {
      this.tiles = this.tiles.map(t => { let n = new TiledTile(); initializeFromJSON(t, n); return n; });
      this.tiles.forEach(t => t.resolveDependencies(self, engine));
    }
  }

  public getTileRect(index: number): Rect {
    return new Rect((index % this.columns) * this.tilewidth, Math.floor(index / this.columns) * this.tileheight, this.tilewidth, this.tileheight);
  }
}