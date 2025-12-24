import {} from "./Color.js";
import { Rect } from "./Rect.js";
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
    static createBlank(width, height) {
        const imageData = new Uint8ClampedArray(width * height * 4); // Create a blank image data array
        imageData.fill(255); // Fill the array with white pixels (RGBA: 255, 255, 255, 255)
        return new RawImage(imageData, width, height);
    }
    fillWithColor(color) {
        const { r, g, b, a } = color;
        for (let i = 0; i < this.imageData.length; i += 4) {
            this.imageData[i] = r;
            this.imageData[i + 1] = g;
            this.imageData[i + 2] = b;
            this.imageData[i + 3] = a;
        }
    }
    fillColorRect(rect, color) {
        for (let y = rect.y; y < rect.y + rect.height; y++) {
            for (let x = rect.x; x < rect.x + rect.width; x++) {
                const index = (y * this._width + x) * 4;
                this.imageData[index] = color.r;
                this.imageData[index + 1] = color.g;
                this.imageData[index + 2] = color.b;
                this.imageData[index + 3] = color.a;
            }
        }
    }
    blit(source, sourceRect, destX, destY) {
        let destIndex = (destY * this._width + destX) * 4;
        const sourceWidth = sourceRect.width;
        const sourceHeight = sourceRect.height;
        for (let y = 0; y < sourceHeight && y + destY < this._height; y++) {
            for (let x = 0; x < sourceWidth && x + destX < this._width; x++) {
                const sourceX = sourceRect.x + x;
                const sourceY = sourceRect.y + y;
                if (sourceX >= 0 && sourceX < source._width && sourceY >= 0 && sourceY < source._height) {
                    const sourceIndex = (sourceY * source._width + sourceX) * 4;
                    this.imageData[destIndex] = source.imageData[sourceIndex]; // Copy Red value
                    this.imageData[destIndex + 1] = source.imageData[sourceIndex + 1]; // Copy Green value
                    this.imageData[destIndex + 2] = source.imageData[sourceIndex + 2]; // Copy Blue value
                    this.imageData[destIndex + 3] = source.imageData[sourceIndex + 3]; // Copy Alpha value
                }
                destIndex += 4;
            }
            destIndex += (this._width - Math.min(sourceWidth, this._width - destX)) * 4; // Skip to next row in destination
        }
    }
    sample(u, v, filter = 'nearest') {
        let x, y;
        if (filter === 'nearest') {
            x = Math.round(u * (this._width - 1));
            y = Math.round(v * (this._height - 1));
        }
        else if (filter === 'bilinear') {
            const posX = u * (this._width - 1);
            const posY = v * (this._height - 1);
            const x1 = Math.floor(posX);
            const y1 = Math.floor(posY);
            const x2 = Math.min(x1 + 1, this._width - 1);
            const y2 = Math.min(y1 + 1, this._height - 1);
            const dx = posX - x1;
            const dy = posY - y1;
            const color1 = this.getColorAt(x1, y1);
            const color2 = this.getColorAt(x2, y1);
            const color3 = this.getColorAt(x1, y2);
            const color4 = this.getColorAt(x2, y2);
            const color = {
                r: this.interpolate(color1.r, color2.r, color3.r, color4.r, dx, dy),
                g: this.interpolate(color1.g, color2.g, color3.g, color4.g, dx, dy),
                b: this.interpolate(color1.b, color2.b, color3.b, color4.b, dx, dy),
                a: this.interpolate(color1.a, color2.a, color3.a, color4.a, dx, dy)
            };
            return color;
        }
        else {
            throw new Error('Unsupported filter type');
        }
        return this.getColorAt(x, y);
    }
    getColorAt(x, y) {
        const index = (y * this._width + x) * 4;
        const data = this.imageData;
        return {
            r: data[index],
            g: data[index + 1],
            b: data[index + 2],
            a: data[index + 3]
        };
    }
    interpolate(c1, c2, c3, c4, dx, dy) {
        return c1 * (1 - dx) * (1 - dy) + c2 * dx * (1 - dy) + c3 * (1 - dx) * dy + c4 * dx * dy;
    }
    sampledBlit(source, sourceRect, destRect) {
        for (let y = 0; y < destRect.height; y++) {
            for (let x = 0; x < destRect.width; x++) {
                const u = x / destRect.width;
                const v = y / destRect.height;
                const sourceX = sourceRect.x + u * sourceRect.width;
                const sourceY = sourceRect.y + v * sourceRect.height;
                const color = source.sample(sourceX / (source._width), sourceY / (source._height), 'nearest');
                const destX = destRect.x + x;
                const destY = destRect.y + y;
                if (destX >= 0 && destX < this._width && destY >= 0 && destY < this._height) {
                    const destIndex = (destY * this._width + destX) * 4;
                    this.imageData[destIndex] = color.r;
                    this.imageData[destIndex + 1] = color.g;
                    this.imageData[destIndex + 2] = color.b;
                    this.imageData[destIndex + 3] = color.a;
                }
            }
        }
    }
    shade(callback, destRect) {
        const destWidth = destRect.width;
        const destHeight = destRect.height;
        for (let y = 0; y < destHeight; y++) {
            for (let x = 0; x < destWidth; x++) {
                const u = x / (destWidth - 1);
                const v = y / (destHeight - 1);
                const color = callback(destRect.x + x, destRect.y + y, u, v);
                const destX = destRect.x + x;
                const destY = destRect.y + y;
                if (destX >= 0 && destX < this._width && destY >= 0 && destY < this._height) {
                    const destIndex = (destY * this._width + destX) * 4;
                    this.imageData[destIndex] = color.r;
                    this.imageData[destIndex + 1] = color.g;
                    this.imageData[destIndex + 2] = color.b;
                    this.imageData[destIndex + 3] = color.a;
                }
            }
        }
    }
}
//# sourceMappingURL=RawImage.js.map