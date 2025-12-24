import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { TiledTilemap } from "./TiledTilemap.js";
export class TiledWorldMap {
    fileName;
    height;
    width;
    x;
    y;
    tilemapAsset = undefined;
    constructor(prototype) {
        let p = prototype;
        this.fileName = p?.fileName ?? "";
        this.height = p?.height ?? 0;
        this.width = p?.width ?? 0;
        this.x = p?.x ?? 0;
        this.y = p?.y ?? 0;
    }
    resolveDependencies(self, engine) {
        this.tilemapAsset = engine.getAsset(self.directory() + this.fileName).asset;
    }
}
export class TiledWorld {
    maps;
    onlyShowAdjacentMaps;
    type;
    constructor(prototype) {
        let p = prototype;
        this.maps = (p?.maps ?? []).map(m => new TiledWorldMap(m));
        this.onlyShowAdjacentMaps = p?.onlyShowAdjacentMaps ?? true;
        this.type = p?.type ?? "";
    }
    resolveDependencies(self, engine) {
        this.maps.forEach(t => t.resolveDependencies(self, engine));
    }
}
//# sourceMappingURL=TiledWorld.js.map