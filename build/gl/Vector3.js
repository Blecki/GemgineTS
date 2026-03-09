;
export class Vector3Raw {
    x = 0;
    y = 0;
    z = 0;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
export class Vector3Buffer {
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
    get z() {
        return this.buffer[2];
    }
    set z(value) {
        this.buffer[2] = value;
    }
    writeFromRaw(raw) {
        this.x = raw.x;
        this.y = raw.y;
        this.z = raw.z;
    }
}
export function v3Add(a, b) {
    return new Vector3Raw(a.x + b.x, a.y + b.y, a.z + b.z);
}
export function v3Sub(a, b) {
    return new Vector3Raw(a.x - b.x, a.y - b.y, a.z - b.z);
}
//# sourceMappingURL=Vector3.js.map