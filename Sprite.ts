import { AssetReference } from "./AssetReference.js";
import { Rect } from "./Rect.js";

export class Sprite {
  public asset: AssetReference;
  public sourceRect: Rect;

  constructor(asset: AssetReference, sourceRect: Rect)
  {
    this.asset = asset;
    this.sourceRect = sourceRect;
  }
}