import { Point } from "./Point.js";
import {} from "./ComponentFactory.js";
export class EntityBlueprint {
    pivot;
    size;
    components;
    constructor(prototype) {
        let p = prototype;
        this.pivot = new Point(p?.pivot);
        this.size = new Point(p?.size);
        this.components = (p?.components ?? []).map(c => c);
    }
}
//# sourceMappingURL=EntityBlueprint.js.map