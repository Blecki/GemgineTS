import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { Point } from "./Point.js";
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
    findMapAt(point) {
        for (let map of this.maps) {
            if (point.x >= map.x
                && point.y >= map.y
                && point.x < (map.x + map.width)
                && point.y < (map.y + map.height))
                return map;
        }
        return null;
    }
    findMapWithName(name) {
        for (let map of this.maps) {
            if (map.fileName == name)
                return map;
        }
        return null;
    }
}
//# sourceMappingURL=TiledWorld.js.map