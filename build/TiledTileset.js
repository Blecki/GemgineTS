import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import { Rect } from "./Rect.js";
import pathCombine from "./PathCombine.js";
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
    constructor(prototype) {
        let p = prototype;
        this.draworder = p?.draworder ?? "";
        this.id = p?.id ?? -1;
        this.name = p?.name ?? "";
        this.objects = (p?.objects ?? []).map(o => new TiledObject(o));
        this.opacity = p?.opacity ?? 1;
        this.type = p?.type ?? "";
        this.visible = p?.visible ?? true;
        this.x = p?.x ?? 0;
        this.y = p?.y ?? 0;
    }
    resolveDependencies(self, engine) {
        this.objects.forEach(t => t.resolveDependencies(self, engine));
    }
}
export class TiledTile {
    id;
    objectgroup;
    constructor(prototype) {
        let p = prototype;
        this.id = p?.id ?? -1;
        this.objectgroup = new TiledObjectGroup(p.objectgroup);
    }
    resolveDependencies(self, engine) {
        this.objectgroup.resolveDependencies(self, engine);
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
    imageAsset = undefined;
    constructor(prototype) {
        let p = prototype;
        this.columns = p?.columns ?? 0;
        this.image = p?.image ?? "";
        this.imageheight = p?.imageheight ?? 0;
        this.imagewidth = p?.imagewidth ?? 0;
        this.margin = p?.margin ?? 0;
        this.name = p?.name ?? "";
        this.spacing = p?.spacing ?? 0;
        this.tilecount = p?.tilecount ?? 0;
        this.tiledversion = p?.tiledversion ?? "";
        this.tileheight = p?.tileheight ?? 0;
        this.tiles = (p?.tiles ?? []).map(t => new TiledTile(t));
        this.tilewidth = p?.tilewidth ?? 0;
        this.type = p?.type ?? "";
        this.version = p?.version ?? "";
    }
    resolveDependencies(self, engine) {
        this.imageAsset = engine.getPreloadedAsset(pathCombine(self.directory(), this.image)).asset;
        this.tiles.forEach(t => t.resolveDependencies(self, engine));
    }
    getTileRect(index) {
        return new Rect((index % (this.columns ?? 1)) * (this.tilewidth ?? 16), Math.floor(index / (this.columns ?? 1)) * (this.tileheight ?? 16), this.tilewidth ?? 16, this.tileheight ?? 16);
    }
}
//# sourceMappingURL=TiledTileset.js.map