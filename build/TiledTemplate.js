import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { TiledObject } from "./TiledObject.js";
import { TiledInlineTileset } from "./TiledInlineTileset.js";
export class TiledTemplate {
    object;
    tileset;
    type;
    basePath;
    constructor(prototype) {
        let p = prototype;
        this.object = new TiledObject(p?.object);
        this.tileset = new TiledInlineTileset(p?.tileset);
        this.type = p?.type ?? "";
        this.basePath = p?.basePath ?? "";
    }
    resolveDependencies(self, engine) {
        this.basePath = self.directory();
        if (this.tileset != undefined) {
            let n = new TiledInlineTileset(this.tileset);
            this.tileset = n;
            this.tileset.resolveDependencies(self, engine);
        }
        if (this.object != undefined) {
            let o = new TiledObject(this.object);
            this.object = o;
            o.resolveDependencies(self, engine);
        }
    }
}
//# sourceMappingURL=TiledTemplate.js.map