import { AssetReference } from "./AssetReference.js";
import { LoadPNG } from "./PngLoader.js";
import { LoadJSON } from "./JsonLoader.js";
export class AssetLoader {
    loaders = new Map([
        ["png", LoadPNG],
        ["json", LoadJSON]
    ]);
    AddLoader(extension, loader) {
        this.loaders.set(extension, loader);
    }
    getFileExtension(filename) {
        const match = filename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
        return match ? match[1] : '';
    }
    getLoaderPromise(basePath, path) {
        var extension = this.getFileExtension(path);
        if (this.loaders.has(extension))
            return this.loaders.get(extension)(basePath, path);
        else {
            console.error(`Unknown asset type: ${extension}`);
            return new Promise(async (resolve, reject) => { resolve(new AssetReference(path, null)); });
        }
    }
    async loadAssets(baseUrl, assetUrls) {
        const promises = assetUrls.map(url => this.getLoaderPromise(baseUrl, url));
        try {
            const loadedAssets = await Promise.all(promises);
            return loadedAssets;
        }
        catch (error) {
            console.error("Error loading assets:", error);
            throw error;
        }
    }
    LoadAssets(baseUrl, assetList, onComplete) {
        this.loadAssets(baseUrl, assetList)
            .then(assets => {
            let assetMap = new Map();
            assets.forEach(a => assetMap.set(a.path, a));
            onComplete(assetMap);
        })
            .catch(error => {
            console.error("Asset loading failed:", error);
        });
    }
}
//# sourceMappingURL=AssetLoader.js.map