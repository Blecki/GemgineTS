import { Point } from "./Point.js";
import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import pathCombine from "./PathCombine.js";

export class Animation {
  public type: string | null = null;
  public spriteSheetPath: string | null = null;
  public spriteSheetAsset: ImageBitmap | null = null;
  public spriteWidth: number  = 16;
  public spriteHeight: number = 16;
  public frames: Point[]  = [];
  public frametime: number = 10;

  public resolveDependencies(self: AssetReference, engine: Engine) {
    if (this.type == "spritesheet" && this.spriteSheetPath != null) {
      let path = pathCombine(self.directory(), this.spriteSheetPath);
      let asset = engine.getAsset(path);
      if (asset != undefined)
        this.spriteSheetAsset = asset.asset;
    }
  }
}