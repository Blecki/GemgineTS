var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AssetStore } from "./AssetStore.js";
import { RenderContext } from "./RenderContext.js";
import { Sprite } from "./Sprite.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { RenderComponent } from "./RenderModule.js";
import { componentType } from "./Component.js";
import { RenderLayers } from "./RenderLayers.js";
import { AssetReference } from "./AssetReference.js";
import { resolveInlineReference } from "./JsonConverter.js";
import { Point } from "./Point.js";
import { AnimationAsset } from "./AnimationSetAsset.js";
import { GameTime } from "./GameTime.js";
import { resolveAsGFX, GfxAsset } from "./GfxAsset.js";
import { AnimationSetAsset } from "./AnimationSetAsset.js";
import { AnimationPlayer } from "./AnimationPlayer.js";
import { AnimationFrame } from "./AnimationFrame.js";
import { HitBoxModule } from "./HitBoxModule.js";
import { Modules } from "./Modules.js";
let SpriteComponent = class SpriteComponent extends RenderComponent {
    gfx;
    offset;
    animations;
    startingAnimation;
    startingFrame;
    scale;
    recordHitBoxes;
    constructor(prototype) {
        super(prototype);
        let p = prototype;
        this.gfx = p?.gfx ?? "";
        this.offset = new Point(p?.offset);
        this.animations = p?.animations;
        this.startingAnimation = p?.startingAnimation ?? "";
        this.startingFrame = new Point(p?.startingFrame);
        this.scale = new Point(p?.scale ?? new Point(1, 1));
        this.recordHitBoxes = p?.recordHitBoxes ?? false;
    }
    resolvedAnimations = undefined;
    gfxAsset = undefined;
    currentAnimation = null;
    animationPlayer = new AnimationPlayer(1, 1, false, 1);
    flip = false;
    cachedHitBoxModule = null;
    resolveDependencies(reference, engine) {
    }
    render(context) {
        let sprite = null;
        let offset = new Point(0, 0);
        if (this.currentAnimation != null) {
            let currentFrame = this.animationPlayer.getCurrentFrame();
            if (this.currentAnimation.gfxAsset != null) {
                offset = this.currentAnimation.offset;
                sprite = this.currentAnimation.gfxAsset.getSprite(this.currentAnimation.frames[currentFrame].x, this.currentAnimation.frames[currentFrame].y);
            }
            else if (this.gfxAsset != null)
                sprite = this.gfxAsset.getSprite(this.currentAnimation.frames[currentFrame].x, this.currentAnimation.frames[currentFrame].y);
        }
        if (sprite != undefined && this.parent != null)
            context.getTarget(this.renderLayer)
                .drawSprite(sprite, this.parent.globalPosition.sub(this.parent.pivot).add(this.offset).add(offset), this.flip);
        if (this.recordHitBoxes && this.cachedHitBoxModule != null && this.currentAnimation != null && this.parent != undefined) {
            let currentFrame = this.currentAnimation.frames[this.animationPlayer.getCurrentFrame()];
            for (let rect of currentFrame.hitBoxes) {
                console.log(rect);
                let worldspaceRect = rect.withOffset(this.parent?.globalPosition).withOffset(offset).withOffset(this.offset).withOffset(this.parent.pivot.negate());
                this.cachedHitBoxModule.recordBox(worldspaceRect, rect.type, this.parent);
            }
        }
    }
    initialize(engine, template, prototypeAsset) {
        this.renderLayer = RenderLayers.ObjectsDiffuse;
        this.gfxAsset = resolveAsGFX(this.gfx, prototypeAsset, engine);
        this.resolvedAnimations = resolveInlineReference(prototypeAsset, engine, this.animations, AnimationSetAsset);
        if (this.resolvedAnimations == undefined) {
            this.currentAnimation = new AnimationAsset();
            this.currentAnimation.frames = [new AnimationFrame({ x: 0, y: 0 })];
        }
        else if (this.startingAnimation != undefined)
            this.currentAnimation = this.resolvedAnimations.getAnimation(this.startingAnimation);
        else if (this.resolvedAnimations.animations != undefined) {
            let t = this.resolvedAnimations?.animations[0];
            if (t == undefined)
                this.currentAnimation = null;
            else
                this.currentAnimation = t;
        }
    }
    awake(assetStore, modules) {
        if (this.recordHitBoxes)
            this.cachedHitBoxModule = modules.getModule(HitBoxModule);
    }
    playAnimation(name, resetFrame) {
        this.currentAnimation = this.resolvedAnimations?.getAnimation(name) ?? null;
        this.animationPlayer.reset(this.currentAnimation?.frames.length ?? 1, this.currentAnimation?.fps ?? 1, this.currentAnimation?.loop ?? false, resetFrame ? 0 : this.animationPlayer.currentPlace);
    }
    isAnimationDone() {
        if (this.currentAnimation == null)
            return true;
        return this.animationPlayer.isAtEnd();
    }
    animate() {
        if (this.currentAnimation != null) {
            this.animationPlayer.advance(GameTime.getDeltaTime());
        }
    }
};
SpriteComponent = __decorate([
    componentType("Sprite"),
    __metadata("design:paramtypes", [Object])
], SpriteComponent);
export { SpriteComponent };
//# sourceMappingURL=SpriteComponent.js.map