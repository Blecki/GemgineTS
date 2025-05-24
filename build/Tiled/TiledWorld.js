import { initializeFromJSON } from "../JsonConverter.js";
export class TiledWorldMap {
    fileName = undefined;
    height = undefined;
    width = undefined;
    x = undefined;
    y = undefined;
    tilemapAsset = undefined;
    resolveDependencies(self, engine) {
        this.tilemapAsset = engine.getAsset(self.directory() + this.fileName).asset;
    }
}
export class TiledWorld {
    maps = undefined;
    onlyShowAdjacentMaps = undefined;
    type = undefined;
    resolveDependencies(self, engine) {
        this.maps = this.maps?.map(m => { let n = new TiledWorldMap(); initializeFromJSON(m, n); return n; });
        this.maps?.forEach(t => t.resolveDependencies(self, engine));
    }
}
//# sourceMappingURL=TiledWorld.js.map