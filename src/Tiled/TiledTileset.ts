import { AssetReference } from "../AssetReference.js";
import { Engine } from "../Engine.js";
import { Rect } from "../Rect.js";
import pathCombine from "../PathCombine.js";
import { initializeFromJSON } from "../JsonConverter.js";
import { TiledObject } from "./TiledObject.js";

export class TiledObjectGroup {
  public draworder: string | undefined = undefined;
  public id: number | undefined = undefined;
  public name: string | undefined = undefined;
  public objects: TiledObject[] | undefined = undefined;
  public opacity: number | undefined = undefined;
  public type: string | undefined = undefined;
  public visible: boolean | undefined = undefined;
  public x: number | undefined = undefined;
  public y: number | undefined = undefined;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.objects != undefined) {
      this.objects = this.objects.map(t => { let n = new TiledObject(); initializeFromJSON(t, n); return n; });
      this.objects.forEach(t => t.resolveDependencies(self, engine));
    }
  }
}

export class TiledTile {
  public id: number | undefined = undefined;
  public objectgroup: TiledObjectGroup | undefined = undefined;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.objectgroup != undefined) {
      let n = new TiledObjectGroup();
      initializeFromJSON(this.objectgroup, n);
      this.objectgroup = n;
    }
  }
}

export class TiledTileset {
  public columns: number | undefined = undefined;
  public image: string | undefined = undefined;
  public imageheight: number | undefined = undefined;
  public imagewidth: number | undefined = undefined;
  public margin: number | undefined = undefined;
  public name: string | undefined = undefined;
  public spacing: number | undefined = undefined;
  public tilecount: number | undefined = undefined;
  public tiledversion: string | undefined = undefined;
  public tileheight: number | undefined = undefined;
  public tiles: TiledTile[] | undefined = undefined;
  public tilewidth: number | undefined = undefined;
  public type: string | undefined = undefined;
  public version: string | undefined = undefined;
  public imageAsset: ImageBitmap | undefined = undefined;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.image != undefined) 
      this.imageAsset = engine.getAsset(pathCombine(self.directory(), this.image)).asset as ImageBitmap;
    if (this.tiles != undefined) {
      this.tiles = this.tiles.map(t => { let n = new TiledTile(); initializeFromJSON(t, n); return n; });
      this.tiles.forEach(t => t.resolveDependencies(self, engine));
    }
  }

  public getTileRect(index: number): Rect {
    return new Rect(
      (index % (this.columns ?? 1)) * (this.tilewidth ?? 16), 
      Math.floor(index / (this.columns ?? 1)) * (this.tileheight ?? 16), 
      this.tilewidth ?? 16, 
      this.tileheight ?? 16);
  }
}