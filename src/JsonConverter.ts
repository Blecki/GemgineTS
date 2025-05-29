import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";

function create<T>(type: (new () => T)): T {
  return new type();
}

export function initializeFromJSON(source: any, destination: any): any {
  for (let property in source) 
    destination[property] = source[property];
  return destination;
}

export function resolveInlineReference<T>(baseReference: AssetReference, engine: Engine, source: any, type: new () => T): T | undefined {
  if (source == undefined) return undefined;
  if (typeof source === "string")
    return engine.getAsset(source).asset as T;
  else {
    let r = initializeFromJSON(source, new type());
    if ('resolveDependencies' in r) 
      r.resolveDependencies(baseReference, engine);
    return r;
  }
}

export function loadAndConvertJSON<T>(creationFunction: () => T) {
  return (basePath: string, path: string): Promise<AssetReference> => {
    return new Promise<AssetReference>(async (resolve, reject) => {
      const response = await fetch(basePath + path);
      if (!response.ok) {
        reject(new Error(`Failed to load JSON at ${path}`));
        return;
      }
      let json = await response.json();
      let result = creationFunction();
      initializeFromJSON(json, result);
      resolve(new AssetReference(path, result));
    });
  }
}