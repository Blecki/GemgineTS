;
export class Vector2Raw {
    x = 0;
    y = 0;
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}
export class Vector2Buffer {
    buffer;
    constructor(buffer) {
        this.buffer = buffer;
    }
    get x() {
        return this.buffer[0];
    }
    set x(value) {
        this.buffer[0] = value;
    }
    get y() {
        return this.buffer[1];
    }
    set y(value) {
        this.buffer[1] = value;
    }
    writeFromRaw(raw) {
        this.x = raw.x;
        this.y = raw.y;
    }
}
export function v2Add(a, b) {
    return new Vector2Raw(a.x + b.x, a.y + b.y);
}
export function v2Sub(a, b) {
    return new Vector2Raw(a.x - b.x, a.y - b.y);
}
//# sourceMappingURL=Vector2.js.map