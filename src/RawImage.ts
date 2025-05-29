import { Color } from "./Color.js";

export class RawImage {
  private readonly imageData: Uint8ClampedArray;
  private readonly _width: number;
  private readonly _height: number;

  constructor(image: Uint8ClampedArray, width: number, height: number) {
    this.imageData = image;
    this._width = width;
    this._height = height;
  }

  public static withTransparency(inputArray: Uint8ClampedArray) {
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

  toImageBitmap(): Promise<ImageBitmap> {
    const blob = new Blob([RawImage.withTransparency(this.imageData)], { type: 'image/png' });
    return createImageBitmap(blob);
  }

  
  get width(): number {
      return this._width;
  }

  get height(): number {
      return this._height;
  }
  
  setPixel([x, y]: [number, number], color: Color): void {
      const index = (y * this._width + x) * 4;
      const data = this.imageData;
      data[index] = color.r;
      data[index + 1] = color.g;
      data[index + 2] = color.b;
      data[index + 3] = color.a;
  }

  getPixel([x, y]: [number, number]): Color {
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
