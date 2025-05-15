import { InitializeFromJSON } from "./JsonConverter.js";
import pathCombine from "./PathCombine.js";
export class TiledLayer {
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
    ResolveDependencies(self, engine) {
        if (this.objects != undefined) {
            this.objects = this.objects.map(t => { var n = new TiledObject(); InitializeFromJSON(t, n); return n; });
            this.objects.forEach(t => t.ResolveDependencies(self, engine));
        }
    }
}
export class TiledObject {
    gid;
    height;
    id;
    name;
    rotation;
    template;
    type;
    visible;
    width;
    x;
    y;
    templateAsset;
    ResolveDependencies(self, engine) {
        if (this.template != null && this.template != "")
            this.templateAsset = engine.AssetMap.get(pathCombine(self.Directory(), this.template));
    }
}
export class TiledInlineTileset {
    firstgid;
    source;
    tilesetAsset;
    ResolveDependencies(self, engine) {
        this.tilesetAsset = engine.AssetMap.get(pathCombine(self.Directory(), this.source)).asset;
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
    ResolveDependencies(self, engine) {
        this.tilesets = this.tilesets.map(t => { var n = new TiledInlineTileset(); InitializeFromJSON(t, n); return n; });
        this.tilesets.forEach(t => t.ResolveDependencies(self, engine));
        this.layers = this.layers.map(t => { var n = new TiledLayer(); InitializeFromJSON(t, n); return n; });
        this.layers.forEach(t => t.ResolveDependencies(self, engine));
    }
}
//# sourceMappingURL=TiledTilemap.js.map