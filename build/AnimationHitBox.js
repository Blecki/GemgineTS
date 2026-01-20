export class AnimationHitBox {
    x;
    y;
    width;
    height;
    type;
    constructor(prototype) {
        let p = prototype;
        this.x = p?.x ?? 0;
        this.y = p?.y ?? 0;
        this.width = p?.width ?? 1;
        this.height = p?.height ?? 1;
        this.type = p?.type ?? "hit";
    }
}
//# sourceMappingURL=AnimationHitBox.js.map