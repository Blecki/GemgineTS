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


type LoadFunction = (basePath: string, path: string) => Promise<AssetReference>;

export class AssetLoader {

  loaders: Map<string, LoadFunction> = new Map([
    ["png", loadPNG],
    ["json", loadJSON],
    ["bmp", loadBMP],
    ["blueprint", loadAndConvertJSON((prototype:object) => new EntityBlueprint(prototype))]
  ]);

  public addLoader(extension: string, loader: LoadFunction) {
    this.loaders.set(extension, loader);
  }

  private getFileExtension(filename: string): string {
    const match = filename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    return match ? match[1] : '';
  }

  private getLoaderPromise(basePath: string, path: string): Promise<AssetReference> {
    let extension = this.getFileExtension(path);

    if (this.loaders.has(extension))
      return this.loaders.get(extension)?.(basePath, path) ?? Promise.resolve(new AssetReference(path, null));
    else
    {
      console.error(`Unknown asset type: ${extension}`);
      return Promise.resolve(new AssetReference(path, null));
    }
  }

  public loadAsset(basePath: string, path: string) : Promise<AssetReference> {
    return this.getLoaderPromise(basePath, path);
  }
 
  async loadAssets_ex(baseUrl: string, assetUrls: string[]) {
    const promises = assetUrls.map(url => this.getLoaderPromise(baseUrl, url));

    try {
      const loadedAssets = await Promise.all(promises);
      return loadedAssets;
    } catch (error) {
      console.error("Error loading assets:", error);
      throw error;
    }
  }

  public loadAssets(baseUrl: string, assetList: string[], onComplete: (Assets: Map<string, AssetReference>) => void) {
    this.loadAssets_ex(baseUrl, assetList)
      .then(assets => {
        let assetMap = new Map<string, AssetReference>();
        assets.forEach(a => assetMap.set(a.path, a));
        onComplete(assetMap);
      })
      .catch(error => {
        console.error("Asset loading failed:", error);
      });
  }

  public setupStandardLoaders() {
      this.addLoader("tmj", loadAndConvertJSON((prototype:object) => new TiledTilemap(prototype)));
      this.addLoader("tsj", loadAndConvertJSON((prototype:object) => new TiledTileset(prototype)));
      this.addLoader("world", loadAndConvertJSON((prototype:object) => new TiledWorld(prototype)));
      this.addLoader("tj", loadAndConvertJSON((prototype:object) => new TiledTemplate(prototype)));
      this.addLoader("anim", loadAndConvertJSON((prototype:object) => new AnimationAsset(prototype)));
      this.addLoader("gfx", loadAndConvertJSON((prototype:object) => new GfxAsset(prototype)));
      this.addLoader("animset", loadAndConvertJSON((prototype:object) => new AnimationSetAsset(prototype)));
      this.addLoader('glsl', loadAndConvertText((text:string) => new Shader(text)));
  }
}
