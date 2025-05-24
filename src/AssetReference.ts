import { Engine } from "./Engine.js";

interface Asset {
  resolveDependencies(reference: AssetReference, engine: Engine): void;
}

export class AssetReference {
  public path: string;
  public asset: any;

  constructor(path: string, asset: any) {
    this.path = path;
    this.asset = asset;
  }

  public directory(): string {
    const separator = this.path.lastIndexOf('/');

    if (separator === -1) {
      return ""; 
    }

    return this.path.substring(0, separator + 1);
  }

  public resolveDependencies(engine: Engine): void {
    if (this.asset !== null && this.asset !== undefined && typeof(this.asset.resolveDependencies) === 'function')
      this.asset.resolveDependencies(this, engine);
  }
}
