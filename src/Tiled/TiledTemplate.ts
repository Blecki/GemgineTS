import { AssetReference } from "../AssetReference.js";
import { initializeFromJSON } from "../JsonConverter.js";
import { Engine } from "../Engine.js";
import { TiledObject } from "./TiledObject.js";
import { TiledInlineTileset } from "./TiledTilemap.js";

export class TiledTemplate {
  public object: TiledObject;
  public tileset: TiledInlineTileset;
  public type: string;
  public basePath: string;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.basePath = self.directory();

    if (this.tileset != undefined) {
      let n = new TiledInlineTileset(); 
      initializeFromJSON(this.tileset, n); 
      this.tileset = n;
      this.tileset.resolveDependencies(self, engine);
    }

    if (this.object != undefined) {
      let o = new TiledObject();
      initializeFromJSON(this.object, o);
      this.object = o;
      o.resolveDependencies(self, engine);
    }
  }
}