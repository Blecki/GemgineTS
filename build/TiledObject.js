import { InitializeFromJSON } from "./JsonConverter.js";
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
    ResolveDependencies(self, engine) {
        if (this.template != null && this.template != "")
            this.templateAsset = engine.AssetMap.get(pathCombine(self.Directory(), this.template));
        if (this.properties != undefined)
            this.properties = this.properties.map(t => { var n = new TiledProperty(); InitializeFromJSON(t, n); return n; });
    }
}
//# sourceMappingURL=TiledObject.js.map