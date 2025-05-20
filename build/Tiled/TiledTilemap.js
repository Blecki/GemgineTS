import { initializeFromJSON } from "../JsonConverter.js";
import pathCombine from "../PathCombine.js";
import { TiledObject } from "./TiledObject.js";
export class TiledLayer {
    class;
    data;
    draworder;
    height;
    id;
    name;
    objects;
    opacity;
    type;
    visible;
    width;
    x;
    y;
    resolveDependencies(self, engine) {
        if (this.objects != undefined) {
            this.objects = this.objects.map(t => { let n = new TiledObject(); initializeFromJSON(t, n); return n; });
            this.objects.forEach(t => t.resolveDependencies(self, engine));
        }
    }
}
export class TiledInlineTileset {
    firstgid;
    source;
    tilesetAsset;
    resolveDependencies(self, engine) {
        this.tilesetAsset = engine.assetMap.get(pathCombine(self.directory(), this.source)).asset;
    }
}
export class TiledTilemap {
    compressionlevel;
    height;
    infinite;
    layers;
    nexlayerid;
    nextobjectid;
    orientation;
    renderorder;
    tiledversion;
    tileheight;
    tilesets;
    tilewidth;
    type;
    version;
    width;
    resolveDependencies(self, engine) {
        this.tilesets = this.tilesets.map(t => { let n = new TiledInlineTileset(); initializeFromJSON(t, n); return n; });
        this.tilesets.forEach(t => t.resolveDependencies(self, engine));
        this.layers = this.layers.map(t => { let n = new TiledLayer(); initializeFromJSON(t, n); return n; });
        this.layers.forEach(t => t.resolveDependencies(self, engine));
    }
}
//# sourceMappingURL=TiledTilemap.js.map