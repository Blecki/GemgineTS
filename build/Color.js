import { Vector3Raw } from "./gl/Vector3.js";
export class Color {
    r;
    g;
    b;
    a;
    constructor(r, g, b, a) {
        if (typeof (r) === 'object') {
            let p = r;
            this.r = p?.r ?? 255;
            this.g = p?.g ?? 255;
            this.b = p?.b ?? 255;
            this.a = p?.a ?? 255;
        }
        else {
            this.r = r ?? 255;
            this.g = g ?? 255;
            this.b = b ?? 255;
            this.a = a ?? 255;
        }
    }
    static lerp(start, end, t) {
        return new Color(start.r + (end.r - start.r) * t, start.g + (end.g - start.g) * t, start.b + (end.b - start.b) * t, start.a + (end.a - start.a) * t);
    }
    static asVector3(me) {
        return new Vector3Raw(me.r, me.g, me.b);
    }
    static get White() { return new Color(255, 255, 255, 1); }
    static get Black() { return new Color(0, 0, 0, 1); }
}
//# sourceMappingURL=Color.js.map