import { initializeFromJSON } from "../JsonConverter.js";
import pathCombine from "../PathCombine.js";
import { Point } from "../Point.js";
export class TiledProperty {
    name = undefined;
    type = undefined;
    value = undefined;
}
export class TiledObject {
    gid = undefined;
    height = undefined;
    id = undefined;
    name = undefined;
    polygon = undefined;
    properties = undefined;
    rotation = undefined;
    template = undefined;
    type = undefined;
    visible = undefined;
    width = undefined;
    x = undefined;
    y = undefined;
    templateAsset = undefined;
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