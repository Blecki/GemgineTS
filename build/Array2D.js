export class Array2D {
    data;
    _width;
    _height;
    constructor(width, height) {
        this.data = new Array(width * height);
        this._width = width;
        this._height = height;
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    setValue(x, y, v) {
        const index = (y * this._width + x);
        this.data[index] = v;
    }
    getValue(x, y) {
        const index = (y * this._width + x);
        return this.data[index];
    }
    inBounds(x, y) {
        if (x < 0 || x >= this._width)
            return false;
        if (y < 0 || y >= this._height)
            return false;
        return true;
    }
    fill(constructor) {
        for (let x = 0; x < this._width * this._height; x++)
            this.data[x] = constructor();
        console.log(this);
    }
}
//# sourceMappingURL=Array2D.js.map