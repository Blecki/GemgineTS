import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import { Rect } from "./Rect.js";
import pathCombine from "./PathCombine.js";
import { TiledObject } from "./TiledObject.js";

type TiledObjectGroupPrototype = {
  draworder: string;
  id: number;
  name: string;
  objects: object[];
  opacity: number;
  type: string;
  visible: boolean;
  x: number;
  y: number;
}

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

  constructor(prototype?:object) {
    let p = prototype as TiledObjectGroupPrototype;
    this.draworder = p?.draworder ?? "";
    this.id = p?.id ?? -1;
    this.name = p?.name ?? "";
    this.objects = (p?.objects ?? []).map(o => new TiledObject(o));
    this.opacity = p?.opacity ?? 1;
    this.type = p?.type ?? "";
    this.visible = p?.visible ?? true;
    this.x = p?.x ?? 0;
    this.y = p?.y ?? 0;
  }

  public resolveDependencies(self: AssetReference, engine: AssetStore) {
    this.objects.forEach(t => t.resolveDependencies(self, engine));
  }
}

type TiledTilePrototype = {
  id: number;
  objectgroup: object;
}

export class TiledTile {
  public id: number;
  public objectgroup: TiledObjectGroup;

  constructor(prototype?:object) {
    let p = prototype as TiledTilePrototype;
    this.id = p?.id ?? -1;
    this.objectgroup = new TiledObjectGroup(p.objectgroup);
  }

  public resolveDependencies(self: AssetReference, engine: AssetStore) {
    this.objectgroup.resolveDependencies(self, engine);
  }
}

type TiledTilesetPrototype = {
  columns: number;
  image: string;
  imageheight: number;
  imagewidth: number;
  margin: number;
  name: string;
  spacing: number;
  tilecount: number;
  tiledversion: string;
  tileheight: number;
  tiles: object[];
  tilewidth: number;
  type: string;
  version: string;
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

  public imageAsset: ImageBitmap | undefined = undefined;

  constructor(prototype?:object) {
    let p = prototype as TiledTilesetPrototype;
    this.columns = p?.columns ?? 0;
    this.image = p?.image ?? "";
    this.imageheight = p?.imageheight ?? 0;
    this.imagewidth = p?.imagewidth ?? 0;
    this.margin = p?.margin ?? 0;
    this.name = p?.name ?? "";
    this.spacing = p?.spacing ?? 0;
    this.tilecount = p?.tilecount ?? 0;
    this.tiledversion = p?.tiledversion ?? "";
    this.tileheight = p?.tileheight ?? 0;
    this.tiles = (p?.tiles ?? []).map(t => new TiledTile(t));
    this.tilewidth = p?.tilewidth ?? 0;
    this.type = p?.type ?? "";
    this.version = p?.version ?? "";
  }

  public resolveDependencies(self: AssetReference, engine: AssetStore) {
    this.imageAsset = engine.getPreloadedAsset(pathCombine(self.directory(), this.image)).asset as ImageBitmap;
    this.tiles.forEach(t => t.resolveDependencies(self, engine));
  }

  public getTileRect(index: number): Rect {
    return new Rect(
      (index % (this.columns ?? 1)) * (this.tilewidth ?? 16), 
      Math.floor(index / (this.columns ?? 1)) * (this.tileheight ?? 16), 
      this.tilewidth ?? 16, 
      this.tileheight ?? 16);
  }
}