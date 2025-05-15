import { Point } from "./Point.js";
export class Transform {
    ID;
    parent;
    position = new Point(0, 0);
    constructor(ID, parent) {
        this.ID = ID;
        this.parent = parent;
    }
}
//# sourceMappingURL=Transform.js.map