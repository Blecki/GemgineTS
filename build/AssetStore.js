import { Module } from "./Module.js";
import { AssetReference } from "./AssetReference.js";
export class AssetStore {
    modules = [];
    assetMap;
    loader;
    basePath;
    constructor(basePath, manifest, loader) {
        this.assetMap = new Map;
        this.loader = loader;
        this.basePath = basePath;
        if (manifest != null) {
            for (const [path, value] of manifest)
                this.assetMap.set(path, value);
            for (const [path, value] of manifest)
                value.resolveDependencies(this);
        }
    }
    getPreloadedAsset(path) {
        console.log("ASSET REQUEST: " + path);
        return this.assetMap?.get(path) ?? new AssetReference(path, null);
    }
    loadAsset(basePath, path) {
        let r = this.assetMap?.get(path);
        if (r != undefined)
            return Promise.resolve(r);
        return new Promise(async (resolve, reject) => {
            const asset = await this.loader.loadAsset(basePath, path);
            this.assetMap.set(path, asset);
            asset.resolveDependencies(this);
            resolve(asset);
        });
    }
}
//# sourceMappingURL=AssetStore.js.map