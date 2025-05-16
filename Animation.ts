import { Point } from "./Point.js";
import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import pathCombine from "./PathCombine.js";

export class Animation {
  public type: string;
  public spriteSheetPath: string;
  public spriteSheetAsset: ImageBitmap;
  public spriteWidth: number;
  public spriteHeight: number;
  public frames: Point[];

  public ResolveDependencies(self: AssetReference, engine: Engine) {
    if (this.type == "spritesheet")
      this.spriteSheetAsset = engine.AssetMap.get(pathCombine(self.Directory(), this.spriteSheetPath)).asset;
  }
}