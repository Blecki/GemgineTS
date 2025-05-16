import { AssetReference } from "./AssetReference.js";
function create(type) {
    return new type();
}
export function initializeFromJSON(source, destination) {
    for (var property in source)
        destination[property] = source[property];
}
export function loadAndConvertJSON(creationFunction) {
    return (basePath, path) => {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(basePath + path);
            if (!response.ok) {
                reject(new Error(`Failed to load JSON at ${path}`));
                return;
            }
            var json = await response.json();
            var result = creationFunction();
            initializeFromJSON(json, result);
            resolve(new AssetReference(path, result));
        });
    };
}
//# sourceMappingURL=JsonConverter.js.map