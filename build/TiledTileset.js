import { Rect } from "./Rect.js";
import pathCombine from "./PathCombine.js";
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
    tilewidth;
    type;
    version;
    imageAsset;
    ResolveDependencies(self, engine) {
        this.imageAsset = engine.AssetMap.get(pathCombine(self.Directory(), this.image)).asset;
    }
    GetTileRect(index) {
        return new Rect((index % this.columns) * this.tilewidth, Math.floor(index / this.columns) * this.tileheight, this.tilewidth, this.tileheight);
    }
}
//# sourceMappingURL=TiledTileset.js.map