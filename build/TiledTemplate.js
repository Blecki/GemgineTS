import { InitializeFromJSON } from "./JsonConverter.js";
import { TiledObject } from "./TiledObject.js";
import { TiledInlineTileset } from "./TiledTilemap.js";
export class TiledTemplate {
    object;
    tileset;
    type;
    basePath;
    ResolveDependencies(self, engine) {
        this.basePath = self.Directory();
        if (this.tileset != undefined) {
            var n = new TiledInlineTileset();
            InitializeFromJSON(this.tileset, n);
            this.tileset = n;
            this.tileset.ResolveDependencies(self, engine);
        }
        if (this.object != undefined) {
            var o = new TiledObject();
            InitializeFromJSON(this.object, o);
            this.object = o;
            o.ResolveDependencies(self, engine);
        }
    }
}
//# sourceMappingURL=TiledTemplate.js.map