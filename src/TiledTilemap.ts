import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { TiledObject, TiledProperty  } from "./TiledObject.js";
import { TiledInlineTileset } from "./TiledInlineTileset.js";

type TiledLayerPrototype = {
  class: string;
  data: number[];
  draworder: string;
  height: number;
  id: number;
  name: string;
  objects: object[];
  opacity: number;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
  properties: object[];
}

export class TiledLayer {
  public class: string;
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
  public properties: TiledProperty[];
  

  constructor(prototype?:object) {
    let p = prototype as TiledLayerPrototype;
    this.class = p?.class ?? "Ground";
    this.data = p?.data ?? [];
    this.draworder = p?.draworder ?? "";
    this.height = p?.height ?? 0;
    this.id = p?.id ?? -1;
    this.name = p?.name ?? "";
    this.objects = (p?.objects ?? []).map(o => new TiledObject(o));
    this.opacity = p?.opacity ?? 1;
    this.type = p?.type ?? "";
    this.visible = p?.visible ?? true;
    this.width = p?.width ?? 0;
    this.x = p?.x ?? 0;
    this.y = p?.y ?? 0;
    this.properties = (p?.properties ?? []).map(p => new TiledProperty(p));
  }

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.objects.forEach(t => t.resolveDependencies(self, engine));
  }
}

type TiledTilemapPrototype = {
  compressionLevel: number;
  height: number;
  infinite: boolean;
  layers: object[];
  nextlayerid: number;
  nextobjectid: number;
  orientation: string;
  renderorder: string;
  tiledversion: string;
  tileheight: number;
  tilesets: object[];
  tilewidth: number;
  type: string;
  version: string;
  width: number;
}

export class TiledTilemap {
  public compressionlevel: number;
  public height: number;
  public infinite: boolean;
  public layers: TiledLayer[];
  public nextlayerid: number;
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

  constructor(prototype?:object) {
    let p = prototype as TiledTilemapPrototype;
    this.compressionlevel = p?.compressionLevel ?? 0;
    this.height = p?.height ?? 0;
    this.infinite = p?.infinite ?? false;
    this.layers = (p?.layers ?? []).map(l => new TiledLayer(l));
    this.nextlayerid = p?.nextlayerid ?? 0;
    this.nextobjectid = p?.nextobjectid ?? 0;
    this.orientation = p?.orientation ?? "";
    this.renderorder = p?.renderorder ?? "";
    this.tiledversion = p?.tiledversion ?? "";
    this.tileheight = p?.tileheight ?? 0;
    this.tilesets = (p?.tilesets ?? []).map(t => new TiledInlineTileset(t));
    this.tilewidth = p?.tilewidth ?? 0;
    this.type = p?.type ?? "";
    this.version = p?.version ?? "";
    this.width = p?.width ?? 0;
  }

  public resolveDependencies(self: AssetReference, engine: Engine) {
    console.log("TRACE: TiledTilemap.resolveDependencies");
    this.tilesets.forEach(t => t.resolveDependencies(self, engine));
    this.layers.forEach(t => t.resolveDependencies(self, engine));
  }
}
