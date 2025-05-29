import { AssetReference } from "./AssetReference.js";

export function loadPNG(basePath: string, path: string): Promise<AssetReference> {
  return new Promise<AssetReference>(async (resolve, reject) => {
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