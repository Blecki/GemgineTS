import { AssetReference } from "./AssetReference.js";
import { loadPNG } from "./PngLoader.js";
import { loadJSON } from "./JsonLoader.js";

type LoadFunction = (basePath: string, path: string) => Promise<AssetReference>;

export class AssetLoader {

  loaders: Map<string, LoadFunction> = new Map([
    ["png", loadPNG],
    ["json", loadJSON]
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
      return this.loaders.get(extension)(basePath, path);
    else
    {
      console.error(`Unknown asset type: ${extension}`);
      return Promise.resolve(new AssetReference(path, null));
    }
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

}
