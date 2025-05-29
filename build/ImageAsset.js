import { IndexedImage } from "./IndexedImage.js";
import { Palette } from "./Palette.js";
import { initializeFromJSON, resolveInlineReference } from "./JsonConverter.js";
import { CompositeImage, CompositeImageLayer } from "./CompositeImage.js";
import { Rect } from "./Rect.js";
import { Sprite } from "./Sprite.js";
import { AnimationSetAsset } from "./AnimationSetAsset.js";
export class CompositeImageLayerAsset {
    sheet = undefined;
    palette = undefined;
}
export class ImageAsset {
    type = undefined;
    path = undefined;
    basePalette = undefined;
    layers = undefined;
    isSheet = undefined;
    tileWidth = undefined;
    tileHeight = undefined;
    animations = undefined;
    fps = undefined;
    currentAnimation = undefined;
    cachedImage = null;
    resolveDependencies(reference, engine) {
        console.log("ImageAsset Resolve Dependencies");
        if (this.layers != undefined)
            this.layers = this.layers.map(l => { let n = new CompositeImageLayerAsset(); initializeFromJSON(l, n); return n; });
        this.isSheet ??= false;
        this.animations = resolveInlineReference(reference, engine, this.animations, AnimationSetAsset);
        this.fps ??= 10;
        this.loadImageCache(engine);
    }
    loadImageCache(engine) {
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
    getSprite(x, y) {
        if (this.cachedImage == null)
            throw new Error("No cached image");
        if (this.isSheet == false)
            return new Sprite(this.cachedImage, new Rect(0, 0, this.cachedImage?.width ?? 1, this.cachedImage?.height ?? 1));
        else
            return new Sprite(this.cachedImage, new Rect(x * (this.tileWidth ?? 0), y * (this.tileHeight ?? 0), this.tileWidth ?? 1, this.tileHeight ?? 1));
    }
}
//# sourceMappingURL=ImageAsset.js.map