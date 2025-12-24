import { Point } from "./Point.js";
import { Component } from "./Component";
export class EntityPrototype {
    pivot;
    size;
    components;
    constructor(prototype) {
        let p = prototype;
        this.pivot = new Point(p?.pivot);
        this.size = new Point(p?.size);
        this.components = p?.components ?? [];
    }
}
//# sourceMappingURL=EntityPrototype.js.map