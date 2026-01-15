import { Point } from "./Point.js";
import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { resolveAsGFX, GfxAsset } from "./GfxAsset.js";
export class AnimationAsset {
    name;
    frames;
    fps;
    gfx;
    loop;
    offset;
    constructor(prototype) {
        let p = prototype;
        this.name = p?.name ?? "unnamed";
        this.frames = (p?.frames ?? []).map(f => new Point(f));
        this.fps = p?.fps ?? 10;
        this.gfx = p?.gfx ?? "";
        this.loop = p?.loop ?? true;
        this.offset = new Point(p?.offset);
    }
    gfxAsset = undefined;
    resolveDependencies(reference, engine) {
        this.gfxAsset = resolveAsGFX(this.gfx, reference, engine);
    }
}
export class AnimationSetAsset {
    animations;
    constructor(prototype) {
        let p = prototype;
        this.animations = (p?.animations ?? []).map(a => new AnimationAsset(a));
    }
    resolveDependencies(self, engine) {
        this.animations ??= [];
        this.animations = this.animations.map(a => new AnimationAsset(a));
        this.animations.forEach(a => a.resolveDependencies(self, engine));
    }
    getAnimation(name) {
        if (this.animations == undefined)
            return null;
        for (let a of this.animations)
            if (a.name == name)
                return a;
        return null;
    }
}
//# sourceMappingURL=AnimationSetAsset.js.map