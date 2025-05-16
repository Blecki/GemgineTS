import { AssetReference } from "./AssetReference.js";
export function loadJSON(basePath, path) {
    return new Promise(async (resolve, reject) => {
        const response = await fetch(basePath + path);
        if (!response.ok) {
            reject(new Error(`Failed to load JSON at ${path}`));
            return;
        }
        resolve(new AssetReference(path, await response.json()));
    });
}
//# sourceMappingURL=JsonLoader.js.map