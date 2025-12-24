import { Engine } from "./Engine.js";
import { RenderingContext } from "./RenderingContext.js";
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
import { GfxAsset } from "./GfxAsset.js";
import { type DebuggableObject, PropertyGrid } from "./Debugger.js";
import { type FluentElement, Fluent } from "./Fluent.js";

type SpriteComponentPrototype = {
  gfx: string;
}

@componentType("Sprite")
export class SpriteComponent extends RenderComponent {
  public gfx: string;

  constructor(prototype?: object) {
    super(prototype);
    let p = prototype as SpriteComponentPrototype;
    this.gfx = p?.gfx ?? "";
  }

  public gfxAsset: GfxAsset | undefined = undefined;
  public sprite: Sprite | null = null;
  public frame: Point | undefined = undefined;
  private currentAnimation: AnimationAsset | null = null;
  private currentPlace: number = 0; 
  public facing: string | undefined = undefined; 
  
  public render(context: RenderingContext) {
    if (this.sprite != null && this.parent != null)
      context.drawSprite(this.sprite, this.parent.globalPosition.sub(this.parent.pivot));
  }

  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference): void {
    console.log("Initializing sprite component");
    this.renderLayer = RenderLayers.Objects;
    this.gfxAsset = resolveInlineReference(prototypeAsset, engine, this.gfx, GfxAsset);
    this.facing ??= "south";

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

  public playAnimation(name: string, resetFrame: boolean) {
    if (this.gfxAsset == undefined) return;
    this.currentAnimation = this.gfxAsset.resolvedAnimations?.getAnimation(name, this.facing) ?? null;
    if (resetFrame) this.currentPlace = 0;
  }
  
  public animate(): void {
    if (this.sprite != null && this.currentAnimation != null && this.gfxAsset?.fps != undefined && this.currentAnimation.frames != undefined) {
      this.currentPlace += GameTime.getDeltaTime();
      let currentFrame = Math.floor(this.currentPlace / (1 / this.gfxAsset.fps)) % this.currentAnimation.frames.length;
      this.sprite = this.gfxAsset.getSprite(this.currentAnimation.frames[currentFrame].x, this.currentAnimation.frames[currentFrame].y);
    }
  }

  
  public createDebugger(name: string): FluentElement {
    let grid = new PropertyGrid(this, name, ["sprite", "gfx", "frame", "currentAnimaton", "currentPlace", "facing"]);
    return grid.getElement();
  }
}