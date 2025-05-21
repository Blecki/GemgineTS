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
    get area() {
        return this.width * this.height;
    }
}
//# sourceMappingURL=Rect.js.map