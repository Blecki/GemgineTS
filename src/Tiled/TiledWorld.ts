import { AssetReference } from "../AssetReference.js";
import { initializeFromJSON } from "../JsonConverter.js";
import { Engine } from "../Engine.js";
import { TiledTilemap } from "./TiledTilemap.js";

export class TiledWorldMap {
  public fileName: string | undefined = undefined;
  public height: number | undefined = undefined;
  public width: number | undefined = undefined;
  public x: number | undefined = undefined;
  public y: number | undefined = undefined;
  public tilemapAsset: TiledTilemap | undefined = undefined;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.tilemapAsset = engine.getAsset(self.directory() + this.fileName).asset as TiledTilemap;
  }
}

export class TiledWorld {
  public maps: TiledWorldMap[] | undefined = undefined;
  public onlyShowAdjacentMaps: boolean | undefined = undefined;
  public type: string | undefined = undefined;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.maps = this.maps?.map(m => { let n = new TiledWorldMap(); initializeFromJSON(m, n); return n; });
    this.maps?.forEach(t => t.resolveDependencies(self, engine));
  }
}