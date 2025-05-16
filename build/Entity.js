import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
export class Entity {
    ID;
    parent;
    position = new Point(0, 0);
    localPosition = new Point(0, 0);
    localBounds = new Rect(-0.5, -0.5, 1, 1);
    pivot = new Point(0, 0);
    components;
    constructor(ID, parent) {
        this.ID = ID;
        this.parent = parent;
        this.components = [];
    }
    getComponent(t) {
        return this.components.find((component) => component instanceof t);
    }
}
//# sourceMappingURL=Entity.js.map