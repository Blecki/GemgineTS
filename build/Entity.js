import { Point } from "./Point.js";
export class Entity {
    ID;
    parent;
    position = new Point(0, 0);
    components;
    constructor(ID, parent) {
        this.ID = ID;
        this.parent = parent;
        this.components = [];
    }
}
//# sourceMappingURL=Entity.js.map