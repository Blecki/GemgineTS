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
import { resolveAsGFX, GfxAsset } from "./GfxAsset.js";
import { type DebuggableObject, PropertyGrid } from "./Debugger.js";
import { type FluentElement, Fluent } from "./Fluent.js";
import { AnimationSetAsset } from "./AnimationSetAsset.js";

type SpriteComponentPrototype = {
  gfx: string | object;
  offset: object;
  animations: string | object;
  startingAnimation: string;
  startingFrame: Point | object;
}

@componentType("Sprite")
export class SpriteComponent extends RenderComponent {
  public gfx: string | object;
  public offset: Point;
  public animations: string | object;
  public startingAnimation: string;
  public startingFrame: Point;
  

  constructor(prototype?: object) {
    super(prototype);
    let p = prototype as SpriteComponentPrototype;
    this.gfx = p?.gfx ?? "";
    this.offset = new Point(p?.offset);
    this.animations = p?.animations;
    this.startingAnimation = p?.startingAnimation ?? "";
    this.startingFrame = new Point(p?.startingFrame);
  }

  private cachedImage: ImageBitmap | null = null;
  public resolvedAnimations: AnimationSetAsset | undefined = undefined;
  public gfxAsset: GfxAsset | undefined = undefined;
  private currentAnimation: AnimationAsset | null = null;
  private currentPlace: number = 0; 
  public flip: boolean = false;
  private currentGfx: GfxAsset | null = null;

  public resolveDependencies(reference: AssetReference, engine: Engine): void {  
  }

  public render(context: RenderContext) {
    let target = context.getTarget(this.renderLayer, this.renderChannel);
    let sprite: Sprite | null = null;
    if (this.currentAnimation != null) {
      let currentFrame = Math.floor(this.currentPlace / (1 / this.currentAnimation.fps)) % this.currentAnimation.frames.length;
      if (this.currentAnimation.gfxAsset != null)
        sprite = this.currentAnimation.gfxAsset.getSprite(this.currentAnimation.frames[currentFrame].x, this.currentAnimation.frames[currentFrame].y);
      else if (this.gfxAsset != null)
        sprite = this.gfxAsset.getSprite(this.currentAnimation.frames[currentFrame].x, this.currentAnimation.frames[currentFrame].y);
    }
    if (sprite != undefined && this.parent != null)
      context.getTarget(this.renderLayer, this.renderChannel)
        .drawSprite(sprite, this.parent.globalPosition.sub(this.parent.pivot).add(this.offset), this.flip);
  }

  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference): void {
    this.renderLayer = RenderLayers.Objects;
    this.renderChannel = RenderChannels.Diffuse;
    this.gfxAsset = resolveAsGFX(this.gfx, prototypeAsset, engine);
    this.resolvedAnimations = resolveInlineReference(prototypeAsset, engine, this.animations, AnimationSetAsset);

    if (this.resolvedAnimations == undefined) {
      this.currentAnimation = new AnimationAsset();
      this.currentAnimation.frames = [ new Point(0, 0) ];
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

  public playAnimation(name: string, resetFrame: boolean) {
    this.currentAnimation = this.resolvedAnimations?.getAnimation(name) ?? null;
    if (resetFrame) this.currentPlace = 0;
  }
  
  public animate(): void {
    if (this.currentAnimation != null) {
      this.currentPlace += GameTime.getDeltaTime();
    }
  }
  
  public createDebugger(name: string): FluentElement {
    let grid = new PropertyGrid(this, name, ["sprite", "gfx", "frame", "currentAnimaton", "currentPlace", "facing"]);
    return grid.getElement();
  }
}