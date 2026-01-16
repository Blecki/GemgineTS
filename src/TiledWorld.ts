import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";

type TiledWorldMapPrototype = {
  fileName: string;
  height: number;
  width: number;
  x: number;
  y: number;
}

export class TiledWorldMap {
  public fileName: string;
  public height: number;
  public width: number;
  public x: number;
  public y: number;

  public tilemapAsset: TiledTilemap | undefined = undefined;

  constructor(prototype?:object) {
    let p = prototype as TiledWorldMapPrototype;
    this.fileName = p?.fileName ?? "";
    this.height = p?.height ?? 0;
    this.width = p?.width ?? 0;
    this.x = p?.x ?? 0;
    this.y = p?.y ?? 0;
  }

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.tilemapAsset = engine.getAsset(self.directory() + this.fileName).asset as TiledTilemap;
  }
}

type TiledWorldPrototype = {
  maps: object[];
  onlyShowAdjacentMaps: boolean;
  type: string;
}

export class TiledWorld {
  public maps: TiledWorldMap[];
  public onlyShowAdjacentMaps: boolean;
  public type: string;

  constructor(prototype?:object) {
    let p = prototype as TiledWorldPrototype;
    this.maps = (p?.maps ?? []).map(m => new TiledWorldMap(m));
    this.onlyShowAdjacentMaps = p?.onlyShowAdjacentMaps ?? true;
    this.type = p?.type ?? "";
  }

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.maps.forEach(t => t.resolveDependencies(self, engine));
  }

  public findMapAt(point: Point): TiledWorldMap | null {
    for (let map of this.maps) {
      if (point.x >= map.x
        && point.y >= map.y
        && point.x < (map.x + map.width)
        && point.y < (map.y + map.height))
        return map;
    }
    return null;
  }

  public findMapWithName(name: string): TiledWorldMap | null {
     for (let map of this.maps) {
      if (map.fileName == name)
        return map;
    }
    return null;
  }

  public findMapsThatTouch(rect: Rect): TiledWorldMap[] {
    let r:TiledWorldMap[] = [];
    for (let map of this.maps) {
      let mapRect = new Rect(map.x, map.y, map.width, map.height);
      if (mapRect.touches(rect))
        r.push(map);
    }
    return r;
  }
}