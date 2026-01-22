import { Module } from "./Module.js";
import { AssetReference } from "./AssetReference.js";
import type { AssetLoader } from "./AssetLoader.js";

export class AssetStore {
  private readonly modules: Module[] = [];
  public assetMap: Map<string, AssetReference>;
  public loader: AssetLoader;
  public basePath: string;

  constructor(basePath: string, manifest: Map<string, AssetReference> | null, loader: AssetLoader) {
    this.assetMap = new Map<string, AssetReference>;
    this.loader = loader;
    this.basePath = basePath;

    if (manifest != null)  {
      for (const [path, value] of manifest) 
        this.assetMap.set(path, value);
      for (const [path, value] of manifest) 
        value.resolveDependencies(this);
    }
  }

  getPreloadedAsset(path: string): AssetReference {
    console.log("ASSET REQUEST: " + path);
    return this.assetMap?.get(path) ?? new AssetReference(path, null);
  }
  
  public loadAsset(basePath: string, path: string) : Promise<AssetReference> {
    let r = this.assetMap?.get(path);
    if (r != undefined) return Promise.resolve(r);
    return new Promise<AssetReference>(async (resolve, reject) => {
      const asset = await this.loader.loadAsset(basePath, path);
      this.assetMap.set(path, asset);
      asset.resolveDependencies(this);
      resolve(asset);
    });
  }
}