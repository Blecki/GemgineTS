import { RawImage } from "./RawImage.js";
import { Palette } from "./Palette.js";

export class IndexedImage {
	private readonly indices: number[];
	public readonly width: number;
	public readonly height: number;

	constructor(image: RawImage, palette: Palette) {
		this.width = image.width;
		this.height = image.height;
		this.indices = [];

		for (let y = 0; y < this.height; y++) {
			for (let x = 0; x < this.width; x++) {
				const pixelColor = image.getPixel([x, y]);
				let index = palette.getIndex(pixelColor);
				if (index == -1) {
					index = 0;
				}
				this.indices.push(index);
			}
		}
	}

	getIndex(x: number, y: number): number {
		return this.indices[y * this.width + x];
	}
	
	toImageBitmap(newPalette: Palette): ImageBitmap {
		const canvas = new OffscreenCanvas(this.width, this.height);
		const ctx = canvas.getContext('2d');
		if (ctx == null) throw new Error("Could not create context from off screen canvas.");
		const imageData = ctx.createImageData(this.width, this.height);
		const data = imageData.data;

		for (let i = 0; i < this.indices.length; i++) {
			const color = newPalette.getColor(this.indices[i]);
			const startIndex = i * 4;
			data[startIndex] = color.r;
			data[startIndex + 1] = color.g;
			data[startIndex + 2] = color.b;
			data[startIndex + 3] = color.a;

			if (color.r == 255 && color.g == 0 && color.b == 255)
				data[startIndex + 3] = 0;
		}

		ctx.putImageData(imageData, 0, 0);
		return canvas.transferToImageBitmap();
	}
}
