import { initializeFromJSON } from "./JsonConverter.js";
import { TiledObject } from "./TiledObject.js";
import { TiledInlineTileset } from "./TiledTilemap.js";
export class TiledTemplate {
    object;
    tileset;
    type;
    basePath;
    resolveDependencies(self, engine) {
        this.basePath = self.directory();
        if (this.tileset != undefined) {
            var n = new TiledInlineTileset();
            initializeFromJSON(this.tileset, n);
            this.tileset = n;
            this.tileset.resolveDependencies(self, engine);
        }
        if (this.object != undefined) {
            var o = new TiledObject();
            initializeFromJSON(this.object, o);
            this.object = o;
            o.resolveDependencies(self, engine);
        }
    }
}
//# sourceMappingURL=TiledTemplate.js.map