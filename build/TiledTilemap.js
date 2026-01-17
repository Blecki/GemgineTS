import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { TiledObject, TiledProperty } from "./TiledObject.js";
import { TiledInlineTileset } from "./TiledInlineTileset.js";
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
    properties;
    constructor(prototype) {
        let p = prototype;
        this.class = p?.class ?? "Ground";
        this.data = p?.data ?? [];
        this.draworder = p?.draworder ?? "";
        this.height = p?.height ?? 0;
        this.id = p?.id ?? -1;
        this.name = p?.name ?? "";
        this.objects = (p?.objects ?? []).map(o => new TiledObject(o));
        this.opacity = p?.opacity ?? 1;
        this.type = p?.type ?? "";
        this.visible = p?.visible ?? true;
        this.width = p?.width ?? 0;
        this.x = p?.x ?? 0;
        this.y = p?.y ?? 0;
        this.properties = (p?.properties ?? []).map(p => new TiledProperty(p));
    }
    resolveDependencies(self, engine) {
        this.objects.forEach(t => t.resolveDependencies(self, engine));
    }
}
export class TiledTilemap {
    compressionlevel;
    height;
    infinite;
    layers;
    nextlayerid;
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
    constructor(prototype) {
        let p = prototype;
        this.compressionlevel = p?.compressionLevel ?? 0;
        this.height = p?.height ?? 0;
        this.infinite = p?.infinite ?? false;
        this.layers = (p?.layers ?? []).map(l => new TiledLayer(l));
        this.nextlayerid = p?.nextlayerid ?? 0;
        this.nextobjectid = p?.nextobjectid ?? 0;
        this.orientation = p?.orientation ?? "";
        this.renderorder = p?.renderorder ?? "";
        this.tiledversion = p?.tiledversion ?? "";
        this.tileheight = p?.tileheight ?? 0;
        this.tilesets = (p?.tilesets ?? []).map(t => new TiledInlineTileset(t));
        this.tilewidth = p?.tilewidth ?? 0;
        this.type = p?.type ?? "";
        this.version = p?.version ?? "";
        this.width = p?.width ?? 0;
    }
    resolveDependencies(self, engine) {
        console.log("TRACE: TiledTilemap.resolveDependencies");
        this.tilesets.forEach(t => t.resolveDependencies(self, engine));
        this.layers.forEach(t => t.resolveDependencies(self, engine));
    }
}
//# sourceMappingURL=TiledTilemap.js.map