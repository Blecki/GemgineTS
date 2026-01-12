import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { TiledObject } from "./TiledObject.js";
import { TiledInlineTileset } from "./TiledInlineTileset.js";

type TiledTemplatePrototype = {
  object: object;
  tileset: object;
  type: string;
  basePath: string;

}

export class TiledTemplate {
  public object: TiledObject;
  public tileset: TiledInlineTileset;
  public type: string;
  public basePath: string;

  constructor(prototype?:object) {
    let p = prototype as TiledTemplatePrototype;
    this.object = new TiledObject(p?.object);
    this.tileset = new TiledInlineTileset(p?.tileset);
    this.type = p?.type ?? "";
    this.basePath = p?.basePath ?? "";
  }

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.basePath = self.directory();

    if (this.tileset != undefined) {
      let n = new TiledInlineTileset(this.tileset); 
      this.tileset = n;
      this.tileset.resolveDependencies(self, engine);
    }

    if (this.object != undefined) {
      let o = new TiledObject(this.object);
      this.object = o;
      o.resolveDependencies(self, engine);
    }
  }
}