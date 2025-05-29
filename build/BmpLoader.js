import { AssetReference } from "./AssetReference.js";
import { RawImage } from "./RawImage.js";
export function loadBMP(basePath, path) {
    return new Promise(async (resolve, reject) => {
        fetch(basePath + path)
            .then(response => response.arrayBuffer())
            .then(arrayBuffer => {
            const dataView = new DataView(arrayBuffer);
            // Check if the file is a BMP (BMP files start with the signature 'BM')
            if (dataView.getUint16(0, false) !== 0x424D) {
                reject(new Error('Not a valid BMP file'));
                return;
            }
            // Extract width and height from the BMP file
            const width = dataView.getUint32(18, true);
            const height = dataView.getUint32(22, true);
            // Calculate the offset to the pixel data
            const pixelDataOffset = dataView.getUint32(10, true);
            // Extract pixel data from the BMP file
            const pixelData = new Uint8ClampedArray(arrayBuffer, pixelDataOffset);
            const flippedPixelData = new Uint8ClampedArray(width * height * 4);
            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const offset = (y * width + x) * 4; // Offset for RGB values
                    const flippedOffset = ((height - y - 1) * width + x) * 4; // Offset for RGBA values
                    flippedPixelData[flippedOffset] = pixelData[offset + 2]; // Red
                    flippedPixelData[flippedOffset + 1] = pixelData[offset + 1]; // Green
                    flippedPixelData[flippedOffset + 2] = pixelData[offset + 0]; // Blue
                    flippedPixelData[flippedOffset + 3] = pixelData[offset + 3]; // Alpha.
                }
            }
            resolve(new AssetReference(path, new RawImage(flippedPixelData, width, height)));
        })
            .catch(error => {
            reject(new Error('Error loading the file'));
        });
    });
}
//# sourceMappingURL=BmpLoader.js.map