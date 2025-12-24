import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
export function resolveInlineReference(baseReference, engine, source, type) {
    if (source == undefined)
        return undefined;
    if (typeof source === "string")
        return engine.getAsset(source).asset;
    if (typeof source === "object") {
        let r = new type(source);
        r.resolveDependencies(baseReference, engine);
        return r;
    }
    throw "Inline reference could not be resolved.";
}
export function loadAndConvertJSON(creationFunction) {
    return (basePath, path) => {
        return new Promise(async (resolve, reject) => {
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
    };
}
//# sourceMappingURL=JsonConverter.js.map