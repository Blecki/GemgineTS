import { Point } from "./Point.js";
import { Component } from "./Component.js";
import { Rect } from "./Rect.js";
import { QuadTree } from "./QuadTree.js";
import { PropertyGrid } from "./Debugger.js";
import { Fluent } from "./Fluent.js";
export class Entity {
    ID;
    parent;
    name = "unnamed";
    storageNode = null;
    localPosition = new Point(0, 0);
    get globalPosition() {
        if (!this.parent)
            return this.localPosition;
        return this.parent.globalPosition.add(this.localPosition);
    }
    get localBounds() {
        return new Rect(this.localPosition.x - this.pivot.x, this.localPosition.y - this.pivot.y, this.size.x, this.size.y);
    }
    get globalBounds() {
        let gp = this.globalPosition;
        return new Rect(gp.x - this.pivot.x, gp.y - this.pivot.y, this.size.x, this.size.y);
    }
    pivot = new Point(0, 0);
    size = new Point(8, 8);
    components;
    children;
    constructor(ID, prototype) {
        this.ID = ID;
        this.parent = null;
        this.components = [];
        this.children = [];
        let entityPrototype = prototype;
        this.pivot = entityPrototype?.pivot ?? new Point(0, 0);
        this.size = entityPrototype?.size ?? new Point(8, 8);
    }
    addChild(other) {
        other.parent = this;
        this.children.push(other);
    }
    getComponent(t) {
        return this.components.find((component) => component instanceof t);
    }
    createDebugger(name) {
        console.log("Trace: Entity.createDebugger");
        let grid = new PropertyGrid(this, name, ["ID", "name", "localPosition", "globalPosition", "pivot", "size", "components", "children"]);
        return grid.getElement();
    }
}
//# sourceMappingURL=Entity.js.map