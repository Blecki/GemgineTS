import { AssetReference } from "./AssetReference.js";
import { Rect } from "./Rect.js";

export class Sprite {
  public image: ImageBitmap;
  public sourceRect: Rect;

  constructor(image: ImageBitmap, sourceRect: Rect)
  {
    this.image = image;
    this.sourceRect = sourceRect;
  }
}