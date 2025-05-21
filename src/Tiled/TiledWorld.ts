import { AssetReference } from "../AssetReference.js";
import { initializeFromJSON } from "../JsonConverter.js";
import { Engine } from "../Engine.js";
import { TiledTilemap } from "./TiledTilemap.js";

export class TiledWorldMap {
  public fileName: string;
  public height: number;
  public width: number;
  public x: number;
  public y: number;
  public tilemapAsset: TiledTilemap;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.tilemapAsset = engine.assetMap.get(self.directory() + this.fileName).asset as TiledTilemap;
  }
}

export class TiledWorld {
  public maps: TiledWorldMap[];
  public onlyShowAdjacentMaps: boolean;
  public type: string;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.maps = this.maps.map(m => { let n = new TiledWorldMap(); initializeFromJSON(m, n); return n; });
    this.maps.forEach(t => t.resolveDependencies(self, engine));
  }
}