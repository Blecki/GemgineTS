import { Rect } from "./Rect.js";
export class QuadTree {
    boundary;
    leafLimit;
    minimumLeafArea;
    leaves;
    items = [];
    constructor(boundary, leafLimit, minimumLeafArea, items) {
        this.boundary = boundary;
        this.leafLimit = leafLimit;
        this.minimumLeafArea = minimumLeafArea;
        this.leaves = null;
        for (let item of items)
            this.insert(item);
    }
    insert(point) {
        if (this.boundary.overlaps(point.globalBounds)) {
            if (this.leaves != null)
                for (let leaf of this.leaves)
                    leaf.insert(point);
            else if (this.items.length < this.leafLimit || this.boundary.area <= this.minimumLeafArea) {
                this.items.push(point);
                point.storageNode = this;
            }
            else {
                this.subdivide();
                if (this.leaves != null)
                    for (let leaf of this.leaves)
                        leaf.insert(point);
            }
        }
    }
    subdivide() {
        const x = this.boundary.x;
        const y = this.boundary.y;
        const w = this.boundary.width / 2;
        const h = this.boundary.height / 2;
        this.leaves = [
            new QuadTree(new Rect(x + w, y, w, h), this.leafLimit, this.minimumLeafArea, this.items),
            new QuadTree(new Rect(x, y, w, h), this.leafLimit, this.minimumLeafArea, this.items),
            new QuadTree(new Rect(x + w, y + h, w, h), this.leafLimit, this.minimumLeafArea, this.items),
            new QuadTree(new Rect(x, y + h, w, h), this.leafLimit, this.minimumLeafArea, this.items)
        ];
        this.items = [];
    }
}
//# sourceMappingURL=QuadTree.js.map