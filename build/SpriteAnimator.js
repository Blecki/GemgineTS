import { SpriteComponent } from "./SpriteComponent.js";
import { AnimationComponent } from "./AnimationModule.js";
import { GameTime } from "./GameTime.js";
import { Sprite } from "./Sprite.js";
import { Rect } from "./Rect.js";
export class SpriteAnimator extends AnimationComponent {
    animation;
    sprite;
    animationAsset;
    currentPlace;
    initialize(engine, template) {
        this.animationAsset = engine.assetMap.get(this.animation).asset;
        this.sprite = this.parent.getComponent(SpriteComponent);
        this.currentPlace = 0;
    }
    animate() {
        this.currentPlace += GameTime.getDeltaTime();
        let currentFrame = Math.floor(this.currentPlace / this.animationAsset.frametime) % this.animationAsset.frames.length;
        this.sprite.sprite = new Sprite(this.animationAsset.spriteSheetAsset, new Rect(this.animationAsset.spriteWidth * this.animationAsset.frames[currentFrame].x, this.animationAsset.spriteHeight * this.animationAsset.frames[currentFrame].y, this.animationAsset.spriteWidth, this.animationAsset.spriteHeight));
    }
}
//# sourceMappingURL=SpriteAnimator.js.map