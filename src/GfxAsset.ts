import { IndexedImage } from "./IndexedImage.js";
import { Palette } from "./Palette.js";
import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { initializeFromJSON, resolveInlineReference } from "./JsonConverter.js";
import { CompositeImage, CompositeImageLayer } from "./CompositeImage.js";
import { Rect } from "./Rect.js";
import { Sprite } from "./Sprite.js";
import { AnimationSetAsset } from "./AnimationSetAsset.js";

export class CompositeImageLayerAsset {
  public sheet: string | undefined = undefined;
  public palette: number | undefined = undefined;
}

export class GfxAsset {
  public type: string | undefined = undefined;
  public path: string | undefined = undefined;
  public basePalette: string | undefined = undefined;
  public layers: CompositeImageLayerAsset[] | undefined = undefined;
  public isSheet: boolean | undefined = undefined;
  public tileWidth: number | undefined = undefined;
  public tileHeight: number | undefined = undefined;
  public animations: AnimationSetAsset | undefined = undefined;
  public fps: number | undefined = undefined;
  public currentAnimation: string | undefined = undefined;

  private cachedImage: ImageBitmap | null = null;

  public resolveDependencies(reference: AssetReference, engine: Engine): void {  
    console.log("ImageAsset Resolve Dependencies");

    if (this.layers != undefined)
      this.layers = this.layers.map(l => { let n = new CompositeImageLayerAsset(); initializeFromJSON(l, n); return n; });

    this.isSheet ??= false;

    this.animations = resolveInlineReference(reference, engine, this.animations, AnimationSetAsset);
    this.fps ??= 10;
    this.loadImageCache(engine);
  }

  public loadImageCache(engine: Engine): void {
    if (this.type == "composite") {
      let basePalette = new Palette(engine.getAsset(this.basePalette ?? "").asset, 0);
      let r = new CompositeImage();
      if (this.layers != undefined)
        for (let layer of this.layers) {
          r.layers.push(new CompositeImageLayer(new IndexedImage(engine.getAsset(layer.sheet ?? "").asset, basePalette), new Palette(basePalette.rawImage, layer.palette ?? 0)));
        }
      this.cachedImage = r.compose();
    }

    if (this.type == "image") {
      this.cachedImage = engine.getAsset(this.path ?? "").asset;
    }

    console.log(this);
  }

  public getSprite(x: number, y: number): Sprite {
    if (this.cachedImage == null) throw new Error("No cached image");
    if (this.isSheet == false)
      return new Sprite(this.cachedImage, new Rect(0, 0, this.cachedImage?.width ?? 1, this.cachedImage?.height ?? 1));
    else 
      return new Sprite(this.cachedImage, new Rect(x * (this.tileWidth ?? 0), y * (this.tileHeight ?? 0), this.tileWidth ?? 1, this.tileHeight ?? 1));
  }
}