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
import { RenderComponent } from "./RenderModule.js";
import { componentType } from "./Component.js";
import { RenderLayers } from "./RenderLayers.js";
import { resolveInlineReference } from "./JsonConverter.js";
import { Point } from "./Point.js";
import { AnimationAsset } from "./AnimationSetAsset.js";
import { GameTime } from "./GameTime.js";
import { GfxAsset } from "./GfxAsset.js";
let SpriteComponent = (() => {
    let _classDecorators = [componentType("Sprite")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = RenderComponent;
    var SpriteComponent = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            SpriteComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        sprite = null;
        gfx = undefined;
        frame = undefined;
        currentAnimation = null;
        currentPlace = 0;
        facing = undefined;
        render(context) {
            if (this.sprite != null)
                context.drawSprite(this.sprite, this.parent.globalPosition.sub(this.parent.pivot));
        }
        initialize(engine, template, prototypeAsset) {
            this.renderLayer = RenderLayers.Objects;
            this.gfx = resolveInlineReference(prototypeAsset, engine, this.gfx, GfxAsset);
            this.facing ??= "south";
            if (this.gfx != undefined) {
                if (this.frame == undefined)
                    this.sprite = this.gfx.getSprite(0, 0);
                else
                    this.sprite = this.gfx.getSprite(this.frame.x, this.frame.y);
            }
            if (this.gfx != undefined) {
                if (this.gfx.animations == undefined) {
                    this.currentAnimation = new AnimationAsset();
                    this.currentAnimation.frames = [new Point(0, 0)];
                }
                else if (this.gfx.currentAnimation != undefined)
                    this.currentAnimation = this.gfx.animations.getAnimation(this.gfx.currentAnimation, this.facing);
                else if (this.gfx.animations.animations != undefined) {
                    let t = this.gfx?.animations?.animations[0];
                    if (t == undefined)
                        this.currentAnimation = null;
                    else
                        this.currentAnimation = t;
                }
            }
        }
        playAnimation(name, resetFrame) {
            if (this.gfx == undefined)
                return;
            this.currentAnimation = this.gfx.animations?.getAnimation(name, this.facing) ?? null;
            if (resetFrame)
                this.currentPlace = 0;
        }
        animate() {
            if (this.sprite != null && this.currentAnimation != null && this.gfx?.fps != undefined && this.currentAnimation.frames != undefined) {
                this.currentPlace += GameTime.getDeltaTime();
                let currentFrame = Math.floor(this.currentPlace / (1 / this.gfx.fps)) % this.currentAnimation.frames.length;
                this.sprite = this.gfx.getSprite(this.currentAnimation.frames[currentFrame].x, this.currentAnimation.frames[currentFrame].y);
            }
        }
    };
    return SpriteComponent = _classThis;
})();
export { SpriteComponent };
//# sourceMappingURL=SpriteComponent.js.map