import { AssetStore } from "./AssetStore.js";

export interface Asset {
  resolveDependencies(reference: AssetReference, engine: AssetStore): void;
}

type AssetReferencePrototype = {
  path: string;
  asset: any;
}

export class AssetReference {
  public path: string;
  public asset: any;

  constructor(prototype?:object);
  constructor(path: string, asset: any);
  constructor(first?: string | object, asset?: any) {
    this.path = "";
    if (first === undefined) throw "Can't create undefined asset reference.";
    if (typeof first === 'object') {
      let p = first as AssetReferencePrototype;
      this.path = p.path;
      this.asset = p.asset;
    }
    else if (typeof first === 'string') {
      this.path = first;
      this.asset = asset;
    }
  }

  public directory(): string {
    const separator = this.path.lastIndexOf('/');

    if (separator === -1) {
      return ""; 
    }

    return this.path.substring(0, separator + 1);
  }

  public resolveDependencies(engine: AssetStore): void {
    if (this.asset !== null && this.asset !== undefined && typeof(this.asset.resolveDependencies) === 'function')
      this.asset.resolveDependencies(this, engine);
  }
}
