import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
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
        this.tilemapAsset = engine.getPreloadedAsset(self.directory() + this.fileName).asset;
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
    findMapsThatTouch(rect) {
        let r = [];
        for (let map of this.maps) {
            let mapRect = new Rect(map.x, map.y, map.width, map.height);
            if (mapRect.touches(rect))
                r.push(map);
        }
        return r;
    }
}
//# sourceMappingURL=TiledWorld.js.map