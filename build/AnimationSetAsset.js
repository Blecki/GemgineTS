import { Point } from "./Point.js";
import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
export class AnimationAsset {
    name;
    direction;
    frames;
    resolveDependencies(self, engine) {
        this.frames ??= [];
        this.frames = this.frames.map(f => new Point(f));
    }
    constructor(prototype) {
        let p = prototype;
        this.name = p?.name ?? "unnamed";
        this.direction = p?.direction ?? "north";
        this.frames = (p?.frames ?? []).map(f => new Point(f));
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
    getAnimation(name, direction) {
        if (this.animations == undefined)
            return null;
        for (let a of this.animations)
            if (a.name == name && (direction == undefined || a.direction == direction))
                return a;
        if (direction != undefined)
            return this.getAnimation(name, undefined);
        return null;
    }
}
//# sourceMappingURL=AnimationSetAsset.js.map