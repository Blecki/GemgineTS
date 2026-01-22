import { AssetReference, type Asset } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";

export function resolveInlineReference<T extends Asset>(baseReference: AssetReference, engine: AssetStore, source: any, type: new (prototype:object) => T): T | undefined {
  if (source == undefined) return undefined;
  if (typeof source === "string")
    return engine.getPreloadedAsset(source).asset as T;
  if (typeof source === "object") {
    let r = new type(source);
    r.resolveDependencies(baseReference, engine);
    return r;
  }
  throw "Inline reference could not be resolved.";
}

export function loadAndConvertJSON<T>(creationFunction: (json:object) => T) {
  return (basePath: string, path: string): Promise<AssetReference> => {
    return new Promise<AssetReference>(async (resolve, reject) => {
      const response = await fetch(basePath + path);
      if (!response.ok) {
        reject(new Error(`Failed to load JSON at ${path}`));
        return;
      }
      let text = await response.text();
      let json = JSON.parse(text);
      let result = creationFunction(json);
      resolve(new AssetReference(path, result));
    });
  }
}