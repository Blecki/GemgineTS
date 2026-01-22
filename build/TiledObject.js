import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import pathCombine from "./PathCombine.js";
import { Point } from "./Point.js";
export class TiledProperty {
    name;
    type;
    value;
    constructor(prototype) {
        let p = prototype;
        this.name = p?.name ?? "";
        this.type = p?.type ?? "";
        this.value = p?.value ?? "";
    }
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
    constructor(prototype) {
        let p = prototype;
        this.gid = p?.gid ?? -1;
        this.height = p?.height ?? 1;
        this.id = p?.id ?? -1;
        this.name = p?.name ?? "";
        this.polygon = (p?.polygon ?? []).map(p => new Point(p));
        this.properties = (p?.properties ?? []).map(p => new TiledProperty(p));
        this.rotation = p?.rotation ?? 0;
        this.template = p?.template ?? "";
        this.type = p?.type ?? "";
        this.visible = p?.visible ?? true;
        this.width = p?.width ?? 1;
        this.x = p?.x ?? 0;
        this.y = p?.y ?? 0;
    }
    resolveDependencies(self, engine) {
        if (this.template != null && this.template != "")
            this.templateAsset = engine.assetMap.get(pathCombine(self.directory(), this.template));
    }
}
//# sourceMappingURL=TiledObject.js.map