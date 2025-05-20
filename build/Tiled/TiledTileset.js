import { Rect } from "../Rect.js";
import pathCombine from "../PathCombine.js";
import { initializeFromJSON } from "../JsonConverter.js";
import { TiledObject } from "./TiledObject.js";
export class TiledObjectGroup {
    draworder;
    id;
    name;
    objects;
    opacity;
    type;
    visible;
    x;
    y;
    resolveDependencies(self, engine) {
        if (this.objects != undefined) {
            this.objects = this.objects.map(t => { let n = new TiledObject(); initializeFromJSON(t, n); return n; });
            this.objects.forEach(t => t.resolveDependencies(self, engine));
        }
    }
}
export class TiledTile {
    id;
    objectgroup;
    resolveDependencies(self, engine) {
        if (this.objectgroup != undefined) {
            let n = new TiledObjectGroup();
            initializeFromJSON(this.objectgroup, n);
            this.objectgroup = n;
        }
    }
}
export class TiledTileset {
    columns;
    image;
    imageheight;
    imagewidth;
    margin;
    name;
    spacing;
    tilecount;
    tiledversion;
    tileheight;
    tiles;
    tilewidth;
    type;
    version;
    imageAsset;
    resolveDependencies(self, engine) {
        this.imageAsset = engine.assetMap.get(pathCombine(self.directory(), this.image)).asset;
        if (this.tiles != undefined) {
            this.tiles = this.tiles.map(t => { let n = new TiledTile(); initializeFromJSON(t, n); return n; });
            this.tiles.forEach(t => t.resolveDependencies(self, engine));
        }
    }
    getTileRect(index) {
        return new Rect((index % this.columns) * this.tilewidth, Math.floor(index / this.columns) * this.tileheight, this.tilewidth, this.tileheight);
    }
}
//# sourceMappingURL=TiledTileset.js.map