export class Point {
    x;
    y;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }
    negate() {
        return new Point(-this.x, -this.y);
    }
    sub(other) {
        return new Point(this.x - other.x, this.y - other.y);
    }
}
//# sourceMappingURL=Point.js.map