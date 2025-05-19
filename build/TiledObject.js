import { initializeFromJSON } from "./JsonConverter.js";
import pathCombine from "./PathCombine.js";
import { Point } from "./Point.js";
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
    polygon;
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
            this.properties = this.properties.map(t => { let n = new TiledProperty(); initializeFromJSON(t, n); return n; });
        if (this.polygon != undefined)
            this.polygon = this.polygon.map(t => new Point(t.x, t.y));
    }
}
//# sourceMappingURL=TiledObject.js.map