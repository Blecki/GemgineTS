import { Point } from "./Point.js";
import { initializeFromJSON } from "./JsonConverter.js";
export class AnimationAsset {
    name = undefined;
    direction = undefined;
    frames = [];
    resolveDependencies(self, engine) {
        this.frames ??= [];
        this.frames = this.frames.map(f => initializeFromJSON(f, new Point(0, 0)));
    }
}
export class AnimationSetAsset {
    animations = [];
    resolveDependencies(self, engine) {
        this.animations ??= [];
        this.animations = this.animations.map(a => initializeFromJSON(a, new AnimationAsset()));
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