import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import { TiledTileset } from "./TiledTileset.js";
import pathCombine from "./PathCombine.js";
import { TiledObject, TiledProperty  } from "./TiledObject.js";
import { TiledTile } from "./TiledTileset.js";

type TiledInlineTilesetPrototype = {
  firstgid: number;
  source: string;

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

export class TiledInlineTileset {
  public firstgid: number;
  public source: string;

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

  public tilesetAsset: TiledTileset | undefined = undefined;

  constructor(prototype?:object) {
    let p = prototype as TiledInlineTilesetPrototype;
    this.firstgid = p?.firstgid ?? 0;
    this.source = p?.source ?? "";

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
    console.log("TRACE: TiledInlineTileset.resolveDependencies");
    if (this.source != "")
      this.tilesetAsset = engine.getPreloadedAsset(pathCombine(self.directory(), this.source)).asset as TiledTileset;
    else
      this.tilesetAsset = new TiledTileset(this);
  }
}

