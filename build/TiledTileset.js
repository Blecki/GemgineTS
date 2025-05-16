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
    resolveDependencies(self, engine) {
        this.imageAsset = engine.assetMap.get(pathCombine(self.directory(), this.image)).asset;
    }
    getTileRect(index) {
        return new Rect((index % this.columns) * this.tilewidth, Math.floor(index / this.columns) * this.tileheight, this.tilewidth, this.tileheight);
    }
}
//# sourceMappingURL=TiledTileset.js.map