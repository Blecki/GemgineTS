import { AssetReference } from "./AssetReference.js";
import { InitializeFromJSON } from "./JsonConverter.js";
import { Engine } from "./Engine.js";
import { TiledTilemap } from "./TiledTilemap.js";

export class TiledWorldMap {
  public fileName: string;
  public height: number;
  public width: number;
  public x: number;
  public y: number;
  public tilemapAsset: TiledTilemap;

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    this.tilemapAsset = engine.AssetMap.get(self.Directory() + this.fileName).asset as TiledTilemap;
  }
}

export class TiledWorld {
  public maps: TiledWorldMap[];
  public onlyShowAdjacentMaps: boolean;
  public type: string;

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    this.maps = this.maps.map(m => { var n = new TiledWorldMap(); InitializeFromJSON(m, n); return n; });
    this.maps.forEach(t => t.ResolveDependencies(self, engine));
  }
}