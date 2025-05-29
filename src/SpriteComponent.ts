import { Engine } from "./Engine.js";
import { RenderingContext } from "./RenderingContext.js";
import { Sprite } from "./Sprite.js";
import { TiledTemplate } from "./Tiled/TiledTemplate.js";
import { RenderComponent } from "./RenderModule.js";
import { componentType } from "./Component.js";
import { RenderLayers } from "./RenderLayers.js";
import { AssetReference } from "./AssetReference.js";
import { resolveInlineReference } from "./JsonConverter.js";
import { Point } from "./Point.js";
import { AnimationAsset } from "./AnimationSetAsset.js";
import { GameTime } from "./GameTime.js";
import { GfxAsset } from "./GfxAsset.js";

@componentType("Sprite")
export class SpriteComponent extends RenderComponent {
  public sprite: Sprite | null = null;

  public gfx: GfxAsset | undefined = undefined;
  public frame: Point | undefined = undefined;
  private currentAnimation: AnimationAsset | null = null;
  private currentPlace: number = 0; 
  public facing: string | undefined = undefined; 
  
  public render(context: RenderingContext) {
    if (this.sprite != null)
      context.drawSprite(this.sprite, this.parent.globalPosition.sub(this.parent.pivot));
  }

  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference): void {
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
        this.currentAnimation.frames = [ new Point(0, 0) ];
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

  public playAnimation(name: string, resetFrame: boolean) {
    if (this.gfx == undefined) return;
    this.currentAnimation = this.gfx.animations?.getAnimation(name, this.facing) ?? null;
    if (resetFrame) this.currentPlace = 0;
  }
  
  public animate(): void {
    if (this.sprite != null && this.currentAnimation != null && this.gfx?.fps != undefined && this.currentAnimation.frames != undefined) {
      this.currentPlace += GameTime.getDeltaTime();
      let currentFrame = Math.floor(this.currentPlace / (1 / this.gfx.fps)) % this.currentAnimation.frames.length;
      this.sprite = this.gfx.getSprite(this.currentAnimation.frames[currentFrame].x, this.currentAnimation.frames[currentFrame].y);
    }
  }
}