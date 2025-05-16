import { AssetReference } from "./AssetReference.js";

export function loadJSON(basePath: string, path: string): Promise<AssetReference> {
  return new Promise<AssetReference>(async (resolve, reject) => {
    const response = await fetch(basePath + path);
    if (!response.ok) {
      reject(new Error(`Failed to load JSON at ${path}`));
      return;
    }
    resolve(new AssetReference(path, await response.json()));
  });
}
