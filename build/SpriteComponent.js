var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Engine } from "./Engine.js";
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
import { PropertyGrid } from "./Debugger.js";
import { Fluent } from "./Fluent.js";
import { AnimationSetAsset } from "./AnimationSetAsset.js";
import { AnimationPlayer } from "./AnimationPlayer.js";
let SpriteComponent = class SpriteComponent extends RenderComponent {
    gfx;
    offset;
    animations;
    startingAnimation;
    startingFrame;
    constructor(prototype) {
        super(prototype);
        let p = prototype;
        this.gfx = p?.gfx ?? "";
        this.offset = new Point(p?.offset);
        this.animations = p?.animations;
        this.startingAnimation = p?.startingAnimation ?? "";
        this.startingFrame = new Point(p?.startingFrame);
    }
    cachedImage = null;
    resolvedAnimations = undefined;
    gfxAsset = undefined;
    currentAnimation = null;
    animationPlayer = new AnimationPlayer(1, 1, false, 1);
    flip = false;
    currentGfx = null;
    resolveDependencies(reference, engine) {
    }
    render(context) {
        let target = context.getTarget(this.renderLayer);
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
    }
    initialize(engine, template, prototypeAsset) {
        this.renderLayer = RenderLayers.ObjectsDiffuse;
        this.gfxAsset = resolveAsGFX(this.gfx, prototypeAsset, engine);
        this.resolvedAnimations = resolveInlineReference(prototypeAsset, engine, this.animations, AnimationSetAsset);
        if (this.resolvedAnimations == undefined) {
            this.currentAnimation = new AnimationAsset();
            this.currentAnimation.frames = [new Point(0, 0)];
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
    createDebugger(name) {
        let grid = new PropertyGrid(this, name, ["sprite", "gfx", "frame", "currentAnimaton", "currentPlace", "facing"]);
        return grid.getElement();
    }
};
SpriteComponent = __decorate([
    componentType("Sprite"),
    __metadata("design:paramtypes", [Object])
], SpriteComponent);
export { SpriteComponent };
//# sourceMappingURL=SpriteComponent.js.map