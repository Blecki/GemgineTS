import { InitializeFromJSON } from "./JsonConverter.js";
export class TiledWorldMap {
    fileName;
    height;
    width;
    x;
    y;
    tilemapAsset;
    ResolveDependencies(self, engine) {
        this.tilemapAsset = engine.AssetMap.get(self.Directory() + this.fileName).asset;
    }
}
export class TiledWorld {
    maps;
    onlyShowAdjacentMaps;
    type;
    ResolveDependencies(self, engine) {
        this.maps = this.maps.map(m => { var n = new TiledWorldMap(); InitializeFromJSON(m, n); return n; });
        this.maps.forEach(t => t.ResolveDependencies(self, engine));
    }
}
//# sourceMappingURL=TiledWorld.js.map