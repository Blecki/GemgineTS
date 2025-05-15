import { Engine } from "./Engine.js";

interface Asset {
  ResolveAssets(reference: AssetReference, engine: Engine);
}

export class AssetReference {
  public path: string;
  public asset: any;

  constructor(path: string, asset: any) {
    this.path = path;
    this.asset = asset;
  }

  public Directory() {
    const separator = this.path.lastIndexOf('/');

    if (separator === -1) {
      return ""; 
    }
    return this.path.substring(0, separator + 1);
  }

  public ResolveDependencies(engine: Engine) {
    if (this.asset !== null && this.asset !== undefined && typeof(this.asset.ResolveDependencies) === 'function')
      this.asset.ResolveDependencies(this, engine);
  }
}
