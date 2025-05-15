import { AssetReference } from "./AssetReference.js";

function create<T>(type: (new () => T)): T {
  return new type();
}

export function InitializeFromJSON(source: any, destination: any) {
  for (var property in source) 
    destination[property] = source[property];
}

export function LoadAndConvertJSON<T>(creationFunction: () => T) {
  return (basePath: string, path: string): Promise<AssetReference> => {
    return new Promise<AssetReference>(async (resolve, reject) => {
      const response = await fetch(basePath + path);
      if (!response.ok) {
        reject(new Error(`Failed to load JSON at ${path}`));
        return;
      }
      var json = await response.json();
      var result = creationFunction();
      InitializeFromJSON(json, result);
      resolve(new AssetReference(path, result));
    });
  }
}