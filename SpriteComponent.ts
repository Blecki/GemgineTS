import { RenderComponent } from "./RenderModule.js";
import { RenderingContext } from "./RenderingContext.js";
import { Sprite } from "./Sprite.js";

export class SpriteComponent extends RenderComponent {
  public sprite: Sprite;
  constructor(sprite: Sprite) {
    super();
    this.sprite = sprite;
  }
  public render(context: RenderingContext) {
    context.DrawSprite(this.sprite, this.transform.position);
  }
  public Clone() {
    return new SpriteComponent(this.sprite);
  }
}