import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
export class Entity {
    ID;
    parent;
    name;
    storageNode;
    localPosition = new Point(0, 0);
    get globalPosition() {
        if (!this.parent)
            return this.localPosition;
        return this.parent.globalPosition.add(this.localPosition);
    }
    size = new Point(1, 1);
    get localBounds() {
        return new Rect(this.localPosition.x - this.pivot.x, this.localPosition.y - this.pivot.y, this.size.x, this.size.y);
    }
    get globalBounds() {
        let gp = this.globalPosition;
        return new Rect(gp.x - this.pivot.x, gp.y - this.pivot.y, this.size.x, this.size.y);
    }
    pivot = new Point(0, 0);
    components;
    children;
    constructor(ID) {
        this.ID = ID;
        this.parent = null;
        this.components = [];
        this.children = [];
    }
    addChild(other) {
        other.parent = this;
        this.children.push(other);
    }
    getComponent(t) {
        return this.components.find((component) => component instanceof t);
    }
}
//# sourceMappingURL=Entity.js.map