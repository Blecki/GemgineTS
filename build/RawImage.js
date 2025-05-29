export class RawImage {
    imageData;
    _width;
    _height;
    constructor(image, width, height) {
        this.imageData = image;
        this._width = width;
        this._height = height;
    }
    static withTransparency(inputArray) {
        // Create a copy of the input array
        const newArray = new Uint8ClampedArray(inputArray);
        // Iterate over the array and update alpha value for specific RGB values
        for (let i = 0; i < newArray.length; i += 4) {
            if (newArray[i] === 255 &&
                newArray[i + 1] === 0 &&
                newArray[i + 2] === 255) {
                newArray[i + 3] = 0; // Set alpha value to 0
            }
        }
        return newArray;
    }
    toImageBitmap() {
        const blob = new Blob([RawImage.withTransparency(this.imageData)], { type: 'image/png' });
        return createImageBitmap(blob);
    }
    get width() {
        return this._width;
    }
    get height() {
        return this._height;
    }
    setPixel([x, y], color) {
        const index = (y * this._width + x) * 4;
        const data = this.imageData;
        data[index] = color.r;
        data[index + 1] = color.g;
        data[index + 2] = color.b;
        data[index + 3] = color.a;
    }
    getPixel([x, y]) {
        const index = (y * this._width + x) * 4;
        const data = this.imageData;
        return {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
        };
    }
}
//# sourceMappingURL=RawImage.js.map