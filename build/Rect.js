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
        var x = center.x - (size.x / 2);
        var y = center.y - (size.y / 2);
        var width = size.x;
        var height = size.y;
    }
}
//# sourceMappingURL=Rect.js.map