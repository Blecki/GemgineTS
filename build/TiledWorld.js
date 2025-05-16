import { initializeFromJSON } from "./JsonConverter.js";
export class TiledWorldMap {
    fileName;
    height;
    width;
    x;
    y;
    tilemapAsset;
    resolveDependencies(self, engine) {
        this.tilemapAsset = engine.assetMap.get(self.directory() + this.fileName).asset;
    }
}
export class TiledWorld {
    maps;
    onlyShowAdjacentMaps;
    type;
    resolveDependencies(self, engine) {
        this.maps = this.maps.map(m => { var n = new TiledWorldMap(); initializeFromJSON(m, n); return n; });
        this.maps.forEach(t => t.resolveDependencies(self, engine));
    }
}
//# sourceMappingURL=TiledWorld.js.map