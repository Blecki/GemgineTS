import { AssetReference } from "./AssetReference.js";

export function loadText(basePath: string, path: string): Promise<AssetReference> {
  return new Promise<AssetReference>(async (resolve, reject) => {
    const response = await fetch(basePath + path);
    if (!response.ok) {
      reject(new Error(`Failed to load text at ${path}`));
      return;
    }
    resolve(new AssetReference(path, await response.text()));
  });
}

export function loadAndConvertText<T>(creationFunction: (text:string) => T) {
  return (basePath: string, path: string): Promise<AssetReference> => {
    return new Promise<AssetReference>(async (resolve, reject) => {
      const response = await fetch(basePath + path);
      if (!response.ok) {
        reject(new Error(`Failed to load text at ${path}`));
        return;
      }
      let text = await response.text();
      let result = creationFunction(text);
      resolve(new AssetReference(path, result));
    });
  }
}
