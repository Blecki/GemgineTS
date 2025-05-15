import { AssetReference } from "./AssetReference.js";
import { InitializeFromJSON } from "./JsonConverter.js";
import { Engine } from "./Engine.js";
import { TiledObject } from "./TiledObject.js";
import { TiledInlineTileset } from "./TiledTilemap.js";

export class TiledTemplate {
  public object: TiledObject;
  public tileset: TiledInlineTileset;
  public type: string;
  public basePath: string;

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    this.basePath = self.Directory();

    if (this.tileset != undefined) {
      var n = new TiledInlineTileset(); 
      InitializeFromJSON(this.tileset, n); 
      this.tileset = n;
      this.tileset.ResolveDependencies(self, engine);
    }

    if (this.object != undefined) {
      var o = new TiledObject();
      InitializeFromJSON(this.object, o);
      this.object = o;
      o.ResolveDependencies(self, engine);
    }
  }
}