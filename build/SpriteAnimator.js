var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { SpriteComponent } from "./SpriteComponent.js";
import { Component, componentType } from "./Component.js";
import { GameTime } from "./GameTime.js";
import { Animation } from "./Animation.js";
import { Sprite } from "./Sprite.js";
import { Rect } from "./Rect.js";
let SpriteAnimatorComponent = (() => {
    let _classDecorators = [componentType("SpriteAnimator")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = Component;
    var SpriteAnimatorComponent = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SpriteAnimatorComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        constructor(parent) {
            super(parent);
        }
        animation = null;
        sprite = undefined;
        animationAsset = null;
        currentPlace = 0;
        initialize(engine, template) {
            this.animationAsset = engine.assetMap.get(this.animation ?? "")?.asset ?? new Animation();
            this.sprite = this.parent.getComponent(SpriteComponent);
            this.currentPlace = 0;
        }
        animate() {
            if (this.sprite != null && this.animationAsset != null) {
                this.currentPlace += GameTime.getDeltaTime();
                let currentFrame = Math.floor(this.currentPlace / this.animationAsset.frametime) % this.animationAsset.frames.length;
                if (this.animationAsset.spriteSheetAsset != null) {
                    this.sprite.sprite = new Sprite(this.animationAsset.spriteSheetAsset, new Rect(this.animationAsset.spriteWidth * this.animationAsset.frames[currentFrame].x, this.animationAsset.spriteHeight * this.animationAsset.frames[currentFrame].y, this.animationAsset.spriteWidth, this.animationAsset.spriteHeight));
                }
            }
        }
    };
    return SpriteAnimatorComponent = _classThis;
})();
export { SpriteAnimatorComponent };
//# sourceMappingURL=SpriteAnimator.js.map