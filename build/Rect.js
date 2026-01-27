import { Point } from "./Point.js";
export class Rect {
    x;
    y;
    width;
    height;
    constructor(x, y, width, height) {
        if (x === undefined) {
            this.x = 0;
            this.y = 0;
            this.width = 0;
            this.height = 0;
        }
        else if (typeof x === 'number') {
            this.x = x;
            this.y = y ?? 0;
            this.width = width ?? 0;
            this.height = height ?? 0;
        }
        else {
            let prototype = x;
            this.x = prototype.x;
            this.y = prototype.y;
            this.width = prototype.width;
            this.height = prototype.height;
        }
    }
    set(center, size) {
        this.x = center.x - (size.x / 2);
        this.y = center.y - (size.y / 2);
        this.width = size.x;
        this.height = size.y;
    }
    overlaps(other) {
        return (this.x < other.x + other.width &&
            this.x + this.width > other.x &&
            this.y < other.y + other.height &&
            this.y + this.height > other.y);
    }
    contains(p) {
        return (this.x <= p.x
            && this.x + this.width > p.x
            && this.y <= p.y
            && this.y + this.height > p.y);
    }
    touches(other) {
        return (this.x <= other.x + other.width &&
            this.x + this.width >= other.x &&
            this.y <= other.y + other.height &&
            this.y + this.height >= other.y);
    }
    get area() {
        return this.width * this.height;
    }
    static enumerate(rect, callback) {
        for (let y = rect.y; y < rect.y + rect.height; y++) {
            for (let x = rect.x; x < rect.x + rect.width; x++) {
                callback(x, y);
            }
        }
    }
    static getRelativeDirection(a, b) {
        if (b.x >= a.x + a.width)
            return "east";
        if (b.x + b.width <= a.x)
            return "west";
        if (b.y >= a.y + a.height)
            return "south";
        if (b.y + b.height <= a.y)
            return "north";
        return "huh?";
    }
    withOffset(point) {
        return new Rect(this.x + point.x, this.y + point.y, this.width, this.height);
    }
}
//# sourceMappingURL=Rect.js.map