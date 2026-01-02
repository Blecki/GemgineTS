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
}
//# sourceMappingURL=Color.js.map