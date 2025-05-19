import { Engine } from "./Engine.js";
import { RenderComponent } from "./RenderModule.js";
import { RenderingContext } from "./RenderingContext.js";
import { Sprite } from "./Sprite.js";
import { TiledTemplate } from "./TiledTemplate.js";

export class SpriteComponent extends RenderComponent {
  public sprite: Sprite;
  
  public render(context: RenderingContext) {
    context.drawSprite(this.sprite, this.parent.globalPosition.sub(this.parent.pivot));
  }

  public initialize(engine: Engine, template: TiledTemplate): void {
    this.sprite = new Sprite(template.tileset.tilesetAsset.imageAsset, template.tileset.tilesetAsset.getTileRect(template.object.gid - 1));
  }
}