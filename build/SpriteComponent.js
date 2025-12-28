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
import { RenderLayers, RenderChannels } from "./RenderLayers.js";
import { AssetReference } from "./AssetReference.js";
import { resolveInlineReference } from "./JsonConverter.js";
import { Point } from "./Point.js";
import { AnimationAsset } from "./AnimationSetAsset.js";
import { GameTime } from "./GameTime.js";
import { GfxAsset } from "./GfxAsset.js";
import { PropertyGrid } from "./Debugger.js";
import { Fluent } from "./Fluent.js";
let SpriteComponent = class SpriteComponent extends RenderComponent {
    gfx;
    constructor(prototype) {
        super(prototype);
        let p = prototype;
        this.gfx = p?.gfx ?? "";
    }
    gfxAsset = undefined;
    sprite = null;
    frame = undefined;
    currentAnimation = null;
    currentPlace = 0;
    facing = undefined;
    render(context) {
        if (this.sprite != null && this.parent != null)
            context.getTarget(this.renderLayer, this.renderChannel).drawSprite(this.sprite, this.parent.globalPosition.sub(this.parent.pivot));
    }
    initialize(engine, template, prototypeAsset) {
        console.log("Initializing sprite component");
        this.renderLayer = RenderLayers.Objects;
        this.renderChannel = RenderChannels.Diffuse;
        this.gfxAsset = resolveInlineReference(prototypeAsset, engine, this.gfx, GfxAsset);
        this.facing ??= "south";
        if (this.gfxAsset != undefined) {
            if (this.frame == undefined)
                this.sprite = this.gfxAsset.getSprite(0, 0);
            else
                this.sprite = this.gfxAsset.getSprite(this.frame.x, this.frame.y);
        }
        else {
            // Load sprite from the TiledTemplate.
            if (template?.tileset?.tilesetAsset != undefined && template?.tileset?.tilesetAsset?.imageAsset != undefined && template?.object?.gid != undefined)
                this.sprite = new Sprite(template.tileset.tilesetAsset.imageAsset, template.tileset?.tilesetAsset.getTileRect(template.object.gid - 1));
        }
        if (this.gfxAsset != undefined) {
            if (this.gfxAsset.resolvedAnimations == undefined) {
                this.currentAnimation = new AnimationAsset();
                this.currentAnimation.frames = [new Point(0, 0)];
            }
            else if (this.gfxAsset.currentAnimation != undefined)
                this.currentAnimation = this.gfxAsset.resolvedAnimations.getAnimation(this.gfxAsset.currentAnimation, this.facing);
            else if (this.gfxAsset.resolvedAnimations.animations != undefined) {
                let t = this.gfxAsset?.resolvedAnimations?.animations[0];
                if (t == undefined)
                    this.currentAnimation = null;
                else
                    this.currentAnimation = t;
            }
        }
    }
    playAnimation(name, resetFrame) {
        if (this.gfxAsset == undefined)
            return;
        this.currentAnimation = this.gfxAsset.resolvedAnimations?.getAnimation(name, this.facing) ?? null;
        if (resetFrame)
            this.currentPlace = 0;
    }
    animate() {
        if (this.sprite != null && this.currentAnimation != null && this.gfxAsset?.fps != undefined && this.currentAnimation.frames != undefined) {
            this.currentPlace += GameTime.getDeltaTime();
            let currentFrame = Math.floor(this.currentPlace / (1 / this.gfxAsset.fps)) % this.currentAnimation.frames.length;
            this.sprite = this.gfxAsset.getSprite(this.currentAnimation.frames[currentFrame].x, this.currentAnimation.frames[currentFrame].y);
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