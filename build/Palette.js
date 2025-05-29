export class Palette {
    colors;
    rawImage;
    constructor(imageWrapper, rowIndex) {
        this.colors = [];
        this.rawImage = imageWrapper;
        const width = imageWrapper.width;
        for (let x = 0; x < width; x++) {
            const pixelColor = imageWrapper.getPixel([x, rowIndex]);
            this.colors.push(pixelColor);
        }
    }
    getColor(index) {
        return this.colors[index];
    }
    getIndex(color) {
        return this.colors.findIndex(c => c.r === color.r && c.g === color.g && c.b === color.b && c.a === color.a);
    }
}
//# sourceMappingURL=Palette.js.map