import { Color } from "./Color.js";
import { RawImage } from "./RawImage.js"

export class Palette {
	private readonly colors: Color[];
	public readonly rawImage: RawImage;

	constructor(imageWrapper: RawImage, rowIndex: number) {
		this.colors = [];
		this.rawImage = imageWrapper;
		const width = imageWrapper.width;

		for (let x = 0; x < width; x++) {
			const pixelColor = imageWrapper.getPixel([x, rowIndex]);
			this.colors.push(pixelColor);
		}
	}

	getColor(index: number): Color {
		return this.colors[index];
	}

	getIndex(color: Color): number {
		return this.colors.findIndex(c => c.r === color.r && c.g === color.g && c.b === color.b && c.a === color.a);
	}
}