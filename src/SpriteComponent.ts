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

type SpriteComponentPrototype = {
  gfx: string | object;
  offset: object;
  animations: string | object;
  startingAnimation: string;
  startingFrame: Point | object;
  scale: Point | object;
  recordHitBoxes: boolean;
}

@componentType("Sprite")
export class SpriteComponent extends RenderComponent {
  public gfx: string | object;
  public offset: Point;
  public animations: string | object;
  public startingAnimation: string;
  public startingFrame: Point;
  public scale: Point;
  public recordHitBoxes: boolean;

  constructor(prototype?: object) {
    super(prototype);
    let p = prototype as SpriteComponentPrototype;
    this.gfx = p?.gfx ?? "";
    this.offset = new Point(p?.offset);
    this.animations = p?.animations;
    this.startingAnimation = p?.startingAnimation ?? "";
    this.startingFrame = new Point(p?.startingFrame);
    this.scale = new Point(p?.scale ?? new Point(1,1));
    this.recordHitBoxes = p?.recordHitBoxes ?? false;
  }

  private cachedImage: ImageBitmap | null = null;
  public resolvedAnimations: AnimationSetAsset | undefined = undefined;
  public gfxAsset: GfxAsset | undefined = undefined;
  private currentAnimation: AnimationAsset | null = null;
  private animationPlayer: AnimationPlayer = new AnimationPlayer(1, 1, false, 1);
  public flip: boolean = false;
  private currentGfx: GfxAsset | null = null;
  private cachedHitBoxModule: HitBoxModule | null = null;

  public resolveDependencies(reference: AssetReference, engine: AssetStore): void {  
  }

  public render(context: RenderContext) {
    let target = context.getTarget(this.renderLayer);
    let sprite: Sprite | null = null;
    let offset: Point = new Point(0, 0);
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

  public initialize(engine: AssetStore, template: TiledTemplate, prototypeAsset: AssetReference): void {
    this.renderLayer = RenderLayers.ObjectsDiffuse;
    this.gfxAsset = resolveAsGFX(this.gfx, prototypeAsset, engine);
    this.resolvedAnimations = resolveInlineReference(prototypeAsset, engine, this.animations, AnimationSetAsset);

    if (this.resolvedAnimations == undefined) {
      this.currentAnimation = new AnimationAsset();
      this.currentAnimation.frames = [ new AnimationFrame({x: 0, y: 0}) ];
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

  public awake(assetStore: AssetStore, modules: Modules) {
    if (this.recordHitBoxes) this.cachedHitBoxModule = modules.getModule(HitBoxModule) as HitBoxModule;
  }


  public playAnimation(name: string, resetFrame: boolean) : void {
    this.currentAnimation = this.resolvedAnimations?.getAnimation(name) ?? null;
    this.animationPlayer.reset(
      this.currentAnimation?.frames.length ?? 1, 
      this.currentAnimation?.fps ?? 1, 
      this.currentAnimation?.loop ?? false, 
      resetFrame ? 0 : this.animationPlayer.currentPlace);
  }

  public isAnimationDone() : boolean {
    if (this.currentAnimation == null) return true;
    return this.animationPlayer.isAtEnd();
  }
  
  public animate(): void {
    if (this.currentAnimation != null) {
      this.animationPlayer.advance(GameTime.getDeltaTime());
    }
  }
}