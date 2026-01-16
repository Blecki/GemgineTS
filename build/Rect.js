import { Point } from "./Point.js";
export class Rect {
    x;
    y;
    width;
    height;
    constructor(x, y, width, height) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
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