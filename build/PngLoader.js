import { AssetReference } from "./AssetReference.js";
export function LoadPNG(basePath, path) {
    return new Promise(async (resolve, reject) => {
        const img = new Image();
        img.onload = async () => {
            resolve(new AssetReference(path, await window.createImageBitmap(img)));
        };
        img.onerror = () => {
            reject(new Error(`Failed to load image at ${path}`));
        };
        img.src = basePath + path;
    });
}
//# sourceMappingURL=PngLoader.js.map