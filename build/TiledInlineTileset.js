import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import { TiledTileset } from "./TiledTileset.js";
import pathCombine from "./PathCombine.js";
import { TiledObject, TiledProperty } from "./TiledObject.js";
import { TiledTile } from "./TiledTileset.js";
export class TiledInlineTileset {
    firstgid;
    source;
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
    tilesetAsset = undefined;
    constructor(prototype) {
        let p = prototype;
        this.firstgid = p?.firstgid ?? 0;
        this.source = p?.source ?? "";
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
        console.log("TRACE: TiledInlineTileset.resolveDependencies");
        if (this.source != "")
            this.tilesetAsset = engine.getPreloadedAsset(pathCombine(self.directory(), this.source)).asset;
        else
            this.tilesetAsset = new TiledTileset(this);
    }
}
//# sourceMappingURL=TiledInlineTileset.js.map