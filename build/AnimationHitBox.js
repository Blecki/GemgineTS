import { Rect } from "./Rect.js";
export class AnimationHitBox extends Rect {
    type;
    constructor(prototype) {
        super(prototype);
        let p = prototype;
        this.type = p?.type ?? "hit";
    }
}
//# sourceMappingURL=AnimationHitBox.js.map