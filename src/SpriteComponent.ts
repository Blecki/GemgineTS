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
import { type DebuggableObject, PropertyGrid } from "./Debugger.js";
import { type FluentElement, Fluent } from "./Fluent.js";

type SpriteComponentPrototype = {
  gfx: string;
  offset: object;
}

@componentType("Sprite")
export class SpriteComponent extends RenderComponent {
  public gfx: string;
  public offset: Point;

  constructor(prototype?: object) {
    super(prototype);
    let p = prototype as SpriteComponentPrototype;
    this.gfx = p?.gfx ?? "";
    this.offset = new Point(p?.offset);
  }

  public gfxAsset: GfxAsset | undefined = undefined;
  public sprite: Sprite | null = null;
  public frame: Point | undefined = undefined;
  private currentAnimation: AnimationAsset | null = null;
  private currentPlace: number = 0; 
  public flip: boolean = false;
  
  public render(context: RenderContext) {
    if (this.sprite != null && this.parent != null)
      context.getTarget(this.renderLayer, this.renderChannel)
        .drawSprite(this.sprite, this.parent.globalPosition.sub(this.parent.pivot).add(this.offset), this.flip);
  }

  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference): void {
    this.renderLayer = RenderLayers.Objects;
    this.renderChannel = RenderChannels.Diffuse;

    if (this.gfx.endsWith(".gfx"))
      this.gfxAsset = resolveInlineReference(prototypeAsset, engine, this.gfx, GfxAsset);
    else if (this.gfx.endsWith(".png") || this.gfx.endsWith(".bmp"))
    {
      this.gfxAsset = new GfxAsset({
        type: "image",
        path: this.gfx,
        isSheet: false,
        animations: {}
      });
      this.gfxAsset.resolveDependencies(prototypeAsset, engine);
    }

    if (this.gfxAsset != undefined) {
      if (this.frame == undefined)
        this.sprite = this.gfxAsset.getSprite(0, 0);
      else
        this.sprite = this.gfxAsset.getSprite(this.frame.x, this.frame.y);
    }
    else 
    {
      // Load sprite from the TiledTemplate.
      if (template?.tileset?.tilesetAsset != undefined && template?.tileset?.tilesetAsset?.imageAsset != undefined && template?.object?.gid != undefined)
        this.sprite = new Sprite(template.tileset.tilesetAsset.imageAsset, template.tileset?.tilesetAsset.getTileRect(template.object.gid - 1));
    }

    if (this.gfxAsset != undefined) {
      if (this.gfxAsset.resolvedAnimations == undefined) {
        this.currentAnimation = new AnimationAsset();
        this.currentAnimation.frames = [ new Point(0, 0) ];
      }
      else if (this.gfxAsset.currentAnimation != undefined)
        this.currentAnimation = this.gfxAsset.resolvedAnimations.getAnimation(this.gfxAsset.currentAnimation);
      else if (this.gfxAsset.resolvedAnimations.animations != undefined) {
        let t = this.gfxAsset?.resolvedAnimations?.animations[0];
        if (t == undefined)
          this.currentAnimation = null;
        else
          this.currentAnimation = t;
      }
    }
  }

  public playAnimation(name: string, resetFrame: boolean) {
    if (this.gfxAsset == undefined) return;
    this.currentAnimation = this.gfxAsset.resolvedAnimations?.getAnimation(name) ?? null;
    if (resetFrame) this.currentPlace = 0;
  }
  
  public animate(): void {
    if (this.sprite != null && this.currentAnimation != null && this.gfxAsset != undefined) {
      this.currentPlace += GameTime.getDeltaTime();
      let currentFrame = Math.floor(this.currentPlace / (1 / this.currentAnimation.fps)) % this.currentAnimation.frames.length;
      this.sprite = this.gfxAsset.getSprite(this.currentAnimation.frames[currentFrame].x, this.currentAnimation.frames[currentFrame].y);
    }
  }
  
  public createDebugger(name: string): FluentElement {
    let grid = new PropertyGrid(this, name, ["sprite", "gfx", "frame", "currentAnimaton", "currentPlace", "facing"]);
    return grid.getElement();
  }
}