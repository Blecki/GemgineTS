import { AssetReference } from "./AssetReference.js";
function create(type) {
    return new type();
}
export function initializeFromJSON(source, destination) {
    for (let property in source)
        destination[property] = source[property];
    return destination;
}
export function resolveInlineReference(baseReference, engine, source, type) {
    if (source == undefined)
        return undefined;
    if (typeof source === "string")
        return engine.getAsset(source).asset;
    else {
        let r = initializeFromJSON(source, new type());
        if ('resolveDependencies' in r)
            r.resolveDependencies(baseReference, engine);
        return r;
    }
}
export function loadAndConvertJSON(creationFunction) {
    return (basePath, path) => {
        return new Promise(async (resolve, reject) => {
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
    };
}
//# sourceMappingURL=JsonConverter.js.map