import { IndexedImage } from "./IndexedImage.js";
import { Palette } from "./Palette.js";
import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import { resolveInlineReference } from "./JsonConverter.js";
import { CompositeImage, CompositeImageLayer } from "./CompositeImage.js";
import { Rect } from "./Rect.js";
import { Sprite } from "./Sprite.js";
import { AnimationSetAsset } from "./AnimationSetAsset.js";
export function resolveAsGFX(input, asset, engine) {
    if (typeof input === "object")
        return resolveInlineReference(asset, engine, input, GfxAsset);
    else if (typeof input === "string") {
        if (input.endsWith(".gfx"))
            return resolveInlineReference(asset, engine, input, GfxAsset);
        else if (input.endsWith(".png") || input.endsWith(".bmp")) {
            let r = new GfxAsset({
                type: "image",
                path: input,
                isSheet: false,
                animations: {}
            });
            r.resolveDependencies(asset, engine);
            return r;
        }
    }
}
export class CompositeImageLayerAsset {
    sheet;
    palette;
    constructor(prototype) {
        let p = prototype;
        this.sheet = p?.sheet ?? "nosheet";
        this.palette = p?.palette ?? 0;
    }
}
export class GfxAsset {
    type;
    path;
    basePalette;
    layers;
    isSheet;
    tileWidth;
    tileHeight;
    cachedImage = null;
    constructor(prototype) {
        let p = prototype;
        this.type = p?.type ?? "none";
        this.path = p?.path ?? "";
        this.basePalette = p?.basePalette ?? "";
        this.layers = (p?.layers ?? []).map(l => new CompositeImageLayerAsset(l));
        this.isSheet = p?.isSheet ?? false;
        this.tileWidth = p?.tileWidth ?? 0;
        this.tileHeight = p?.tileHeight ?? 0;
    }
    resolveDependencies(reference, engine) {
        this.loadImageCache(engine);
    }
    loadImageCache(engine) {
        if (this.type == "composite") {
            let basePalette = new Palette(engine.getPreloadedAsset(this.basePalette ?? "").asset, 0);
            let r = new CompositeImage();
            if (this.layers != undefined)
                for (let layer of this.layers) {
                    r.layers.push(new CompositeImageLayer(new IndexedImage(engine.getPreloadedAsset(layer.sheet ?? "").asset, basePalette), new Palette(basePalette.rawImage, layer.palette ?? 0)));
                }
            this.cachedImage = r.compose();
        }
        if (this.type == "image") {
            this.cachedImage = engine.getPreloadedAsset(this.path ?? "").asset;
        }
    }
    getSprite(x, y) {
        if (this.cachedImage == null)
            throw new Error("No cached image");
        if (this.isSheet == false)
            return new Sprite(this.cachedImage, new Rect(0, 0, this.cachedImage?.width ?? 1, this.cachedImage?.height ?? 1));
        else
            return new Sprite(this.cachedImage, new Rect(x * (this.tileWidth ?? 0), y * (this.tileHeight ?? 0), this.tileWidth ?? 1, this.tileHeight ?? 1));
    }
}
//# sourceMappingURL=GfxAsset.js.map