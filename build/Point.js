export class Point {
    x;
    y;
    constructor(first, second) {
        if (first === undefined) {
            this.x = 0;
            this.y = 0;
        }
        else if (typeof first === 'number') {
            this.x = first;
            this.y = second ?? 0;
        }
        else {
            let prototype = first;
            this.x = prototype.x;
            this.y = prototype.y;
        }
    }
    copy() {
        return new Point(this.x, this.y);
    }
    add(other) {
        return new Point(this.x + other.x, this.y + other.y);
    }
    negate() {
        return new Point(-this.x, -this.y);
    }
    negateX() {
        return new Point(-this.x, this.y);
    }
    negateY() {
        return new Point(this.x, -this.y);
    }
    sub(other) {
        return new Point(this.x - other.x, this.y - other.y);
    }
    multiply(other) {
        return new Point(this.x * other, this.y * other);
    }
    truncate() {
        return new Point(Math.floor(this.x), Math.floor(this.y));
    }
    lengthSqrd() {
        return (this.x * this.x) + (this.y * this.y);
    }
    length() {
        return Math.sqrt((this.x * this.x) + (this.y * this.y));
    }
    normalized() {
        let magnitude = Math.sqrt(this.lengthSqrd());
        return new Point(this.x / magnitude, this.y / magnitude);
    }
    static distance(a, b) {
        let d = b.sub(a);
        return d.length();
    }
}
//# sourceMappingURL=Point.js.map