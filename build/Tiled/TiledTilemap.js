import { initializeFromJSON } from "../JsonConverter.js";
import pathCombine from "../PathCombine.js";
import { TiledObject } from "./TiledObject.js";
export class TiledLayer {
    class = undefined;
    data = undefined;
    draworder = undefined;
    height = undefined;
    id = undefined;
    name = undefined;
    objects = undefined;
    opacity = undefined;
    type = undefined;
    visible = undefined;
    width = undefined;
    x = undefined;
    y = undefined;
    resolveDependencies(self, engine) {
        if (this.objects != undefined) {
            this.objects = this.objects.map(t => { let n = new TiledObject(); initializeFromJSON(t, n); return n; });
            this.objects.forEach(t => t.resolveDependencies(self, engine));
        }
    }
}
export class TiledInlineTileset {
    firstgid = undefined;
    source = undefined;
    tilesetAsset = undefined;
    resolveDependencies(self, engine) {
        if (this.source != undefined)
            this.tilesetAsset = engine.getAsset(pathCombine(self.directory(), this.source)).asset;
    }
}
export class TiledTilemap {
    compressionlevel = undefined;
    height = undefined;
    infinite = undefined;
    layers = undefined;
    nexlayerid = undefined;
    nextobjectid = undefined;
    orientation = undefined;
    renderorder = undefined;
    tiledversion = undefined;
    tileheight = undefined;
    tilesets = undefined;
    tilewidth = undefined;
    type = undefined;
    version = undefined;
    width = undefined;
    resolveDependencies(self, engine) {
        this.tilesets = this.tilesets?.map(t => { let n = new TiledInlineTileset(); initializeFromJSON(t, n); return n; });
        this.tilesets?.forEach(t => t.resolveDependencies(self, engine));
        this.layers = this.layers?.map(t => { let n = new TiledLayer(); initializeFromJSON(t, n); return n; });
        this.layers?.forEach(t => t.resolveDependencies(self, engine));
    }
}
//# sourceMappingURL=TiledTilemap.js.map