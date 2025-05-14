import { InitializeFromJSON } from "./AssetManagement/JsonConverter.js";
export class TiledLayer {
    data;
    height;
    id;
    name;
    opacity;
    type;
    visible;
    width;
    x;
    y;
}
export class TiledInlineTileset {
    firstgid;
    source;
    tilesetAsset;
    ResolveDependencies(self, engine) {
        this.tilesetAsset = engine.AssetMap.get(self.Directory() + this.source).asset;
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
    }
}
//# sourceMappingURL=TiledTilemap.js.map