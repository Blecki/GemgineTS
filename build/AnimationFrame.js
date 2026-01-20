import { AnimationHitBox } from "./AnimationHitBox.js";
export class AnimationFrame {
    x;
    y;
    hitBoxes;
    constructor(prototype) {
        let p = prototype;
        this.x = p?.x ?? 0;
        this.y = p?.y ?? 0;
        this.hitBoxes = (p?.hitBoxes ?? []).map(f => new AnimationHitBox(f));
    }
}
//# sourceMappingURL=AnimationFrame.js.map