import { Rect } from "../Rect.js";
import pathCombine from "../PathCombine.js";
import { initializeFromJSON } from "../JsonConverter.js";
import { TiledObject } from "./TiledObject.js";
export class TiledObjectGroup {
    draworder = undefined;
    id = undefined;
    name = undefined;
    objects = undefined;
    opacity = undefined;
    type = undefined;
    visible = undefined;
    x = undefined;
    y = undefined;
    resolveDependencies(self, engine) {
        if (this.objects != undefined) {
            this.objects = this.objects.map(t => { let n = new TiledObject(); initializeFromJSON(t, n); return n; });
            this.objects.forEach(t => t.resolveDependencies(self, engine));
        }
    }
}
export class TiledTile {
    id = undefined;
    objectgroup = undefined;
    resolveDependencies(self, engine) {
        if (this.objectgroup != undefined) {
            let n = new TiledObjectGroup();
            initializeFromJSON(this.objectgroup, n);
            this.objectgroup = n;
        }
    }
}
export class TiledTileset {
    columns = undefined;
    image = undefined;
    imageheight = undefined;
    imagewidth = undefined;
    margin = undefined;
    name = undefined;
    spacing = undefined;
    tilecount = undefined;
    tiledversion = undefined;
    tileheight = undefined;
    tiles = undefined;
    tilewidth = undefined;
    type = undefined;
    version = undefined;
    imageAsset = undefined;
    resolveDependencies(self, engine) {
        if (this.image != undefined)
            this.imageAsset = engine.getAsset(pathCombine(self.directory(), this.image)).asset;
        if (this.tiles != undefined) {
            this.tiles = this.tiles.map(t => { let n = new TiledTile(); initializeFromJSON(t, n); return n; });
            this.tiles.forEach(t => t.resolveDependencies(self, engine));
        }
    }
    getTileRect(index) {
        return new Rect((index % (this.columns ?? 1)) * (this.tilewidth ?? 16), Math.floor(index / (this.columns ?? 1)) * (this.tileheight ?? 16), this.tilewidth ?? 16, this.tileheight ?? 16);
    }
}
//# sourceMappingURL=TiledTileset.js.map