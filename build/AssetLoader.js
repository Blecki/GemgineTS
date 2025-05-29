import { AssetReference } from "./AssetReference.js";
import { loadPNG } from "./PngLoader.js";
import { loadBMP } from "./BmpLoader.js";
import { loadJSON } from "./JsonLoader.js";
export class AssetLoader {
    loaders = new Map([
        ["png", loadPNG],
        ["json", loadJSON],
        ["bmp", loadBMP]
    ]);
    addLoader(extension, loader) {
        this.loaders.set(extension, loader);
    }
    getFileExtension(filename) {
        const match = filename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
        return match ? match[1] : '';
    }
    getLoaderPromise(basePath, path) {
        let extension = this.getFileExtension(path);
        if (this.loaders.has(extension))
            return this.loaders.get(extension)?.(basePath, path) ?? Promise.resolve(new AssetReference(path, null));
        else {
            console.error(`Unknown asset type: ${extension}`);
            return Promise.resolve(new AssetReference(path, null));
        }
    }
    async loadAssets_ex(baseUrl, assetUrls) {
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
    loadAssets(baseUrl, assetList, onComplete) {
        this.loadAssets_ex(baseUrl, assetList)
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