import { IndexedImage } from "./IndexedImage.js";
import { Palette } from "./Palette.js";
import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { resolveInlineReference } from "./JsonConverter.js";
import { CompositeImage, CompositeImageLayer } from "./CompositeImage.js";
import { Rect } from "./Rect.js";
import { Sprite } from "./Sprite.js";
import { AnimationSetAsset } from "./AnimationSetAsset.js";

type CompositeImageLayerAssetPrototype = {
    sheet: string;
    palette: number;
}

export class CompositeImageLayerAsset {
  public sheet: string;
  public palette: number;

  constructor(prototype?:object) {
    let p = prototype as CompositeImageLayerAssetPrototype;
    this.sheet = p?.sheet ?? "nosheet";
    this.palette = p?.palette ?? 0;
  }
}

type GfxAssetPrototype = {
  type: string;
  path: string;
  basePalette: string;
  layers: object[];
  isSheet: boolean;
  tileWidth: number;
  tileHeight: number;
  animations: string | object;
  fps: number;
  currentAnimation: string;
}

export class GfxAsset {
  public type: string;
  public path: string;
  public basePalette: string;
  public layers: CompositeImageLayerAsset[];
  public isSheet: boolean;
  public tileWidth: number;
  public tileHeight: number;
  public animations: string | object;
  public fps: number;
  public currentAnimation: string;

  private cachedImage: ImageBitmap | null = null;
  public resolvedAnimations: AnimationSetAsset | undefined = undefined;

  constructor(prototype?:object) {
    let p = prototype as GfxAssetPrototype;
    this.type = p?.type ?? "none";
    this.path = p?.path ?? "";
    this.basePalette = p?.basePalette ?? "";
    this.layers = (p?.layers ?? []).map(l => new CompositeImageLayerAsset(l));
    this.isSheet = p?.isSheet ?? false;
    this.tileWidth = p?.tileWidth ?? 0;
    this.tileHeight = p?.tileHeight ?? 0;
    this.animations = p?.animations;
    this.fps = p?.fps ?? 10;
    this.currentAnimation = p?.currentAnimation ?? "";
  }

  public resolveDependencies(reference: AssetReference, engine: Engine): void {  
    this.resolvedAnimations = resolveInlineReference(reference, engine, this.animations, AnimationSetAsset);
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
  }

  public getSprite(x: number, y: number): Sprite {
    if (this.cachedImage == null) throw new Error("No cached image");
    if (this.isSheet == false)
      return new Sprite(this.cachedImage, new Rect(0, 0, this.cachedImage?.width ?? 1, this.cachedImage?.height ?? 1));
    else 
      return new Sprite(this.cachedImage, new Rect(x * (this.tileWidth ?? 0), y * (this.tileHeight ?? 0), this.tileWidth ?? 1, this.tileHeight ?? 1));
  }
}