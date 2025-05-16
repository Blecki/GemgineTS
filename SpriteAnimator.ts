import { Engine } from "./Engine.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AnimationComponent } from "./AnimationModule.js";
import { GameTime } from "./GameTime.js";
import { Animation } from "./Animation.js";
import { Sprite } from "./Sprite.js";
import { Rect } from "./Rect.js";

export class SpriteAnimator extends AnimationComponent {
  public animation: string;

  private sprite: SpriteComponent;
  private animationAsset: Animation;
  private currentPlace: number;  
  
  public initialize(engine: Engine, template: TiledTemplate): void {
    this.animationAsset = engine.assetMap.get(this.animation).asset;
    this.sprite = this.parent.getComponent(SpriteComponent);
    this.currentPlace = 0;
  }

  public animate(): void {
    this.currentPlace += GameTime.getDeltaTime();
    var currentFrame = Math.floor(this.currentPlace / this.animationAsset.frametime) % this.animationAsset.frames.length;
    this.sprite.sprite = new Sprite(this.animationAsset.spriteSheetAsset, 
        new Rect(this.animationAsset.spriteWidth * this.animationAsset.frames[currentFrame].x,
                 this.animationAsset.spriteHeight * this.animationAsset.frames[currentFrame].y,
                 this.animationAsset.spriteWidth, this.animationAsset.spriteHeight));
  }
}