import { AssetReference } from "./AssetReference.js";
import { loadPNG } from "./PngLoader.js";
import { loadBMP } from "./BmpLoader.js";
import { loadJSON } from "./JsonLoader.js";
import { loadAndConvertJSON } from "./JsonConverter.js";
import { loadAndConvertText } from "./TextLoader.js";
import { TiledTileset } from "./TiledTileset.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { GfxAsset } from "./GfxAsset.js";
import { AnimationSetAsset, AnimationAsset } from "./AnimationSetAsset.js";
import { Shader } from "./Shader.js";
import { TiledWorld, TiledWorldMap } from "./TiledWorld.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { EntityBlueprint } from "./EntityBlueprint.js";
export class AssetLoader {
    loaders = new Map([
        ["png", loadPNG],
        ["json", loadJSON],
        ["bmp", loadBMP],
        ["blueprint", loadAndConvertJSON((prototype) => new EntityBlueprint(prototype))]
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
    loadAsset(basePath, path) {
        return this.getLoaderPromise(basePath, path);
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
    setupStandardLoaders() {
        this.addLoader("tmj", loadAndConvertJSON((prototype) => new TiledTilemap(prototype)));
        this.addLoader("tsj", loadAndConvertJSON((prototype) => new TiledTileset(prototype)));
        this.addLoader("world", loadAndConvertJSON((prototype) => new TiledWorld(prototype)));
        this.addLoader("tj", loadAndConvertJSON((prototype) => new TiledTemplate(prototype)));
        this.addLoader("anim", loadAndConvertJSON((prototype) => new AnimationAsset(prototype)));
        this.addLoader("gfx", loadAndConvertJSON((prototype) => new GfxAsset(prototype)));
        this.addLoader("animset", loadAndConvertJSON((prototype) => new AnimationSetAsset(prototype)));
        this.addLoader('glsl', loadAndConvertText((text) => new Shader(text)));
    }
}
//# sourceMappingURL=AssetLoader.js.map