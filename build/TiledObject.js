import { initializeFromJSON } from "./JsonConverter.js";
import pathCombine from "./PathCombine.js";
export class TiledProperty {
    name;
    type;
    value;
}
export class TiledObject {
    gid;
    height;
    id;
    name;
    properties;
    rotation;
    template;
    type;
    visible;
    width;
    x;
    y;
    templateAsset;
    resolveDependencies(self, engine) {
        if (this.template != null && this.template != "")
            this.templateAsset = engine.assetMap.get(pathCombine(self.directory(), this.template));
        if (this.properties != undefined)
            this.properties = this.properties.map(t => { var n = new TiledProperty(); initializeFromJSON(t, n); return n; });
    }
}
//# sourceMappingURL=TiledObject.js.map