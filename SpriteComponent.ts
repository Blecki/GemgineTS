import { Engine } from "./Engine.js";
import { RenderComponent } from "./RenderModule.js";
import { RenderingContext } from "./RenderingContext.js";
import { Sprite } from "./Sprite.js";
import { AssetReference } from "./AssetReference.js";
import { TiledInlineTileset } from "./TiledTilemap.js";
import { TiledTemplate } from "./TiledTemplate.js";

export class SpriteComponent extends RenderComponent {
  public sprite: Sprite;
  
  public Render(context: RenderingContext) {
    context.DrawSprite(this.sprite, this.parent.position);
  }

  public Initialize(engine: Engine, template: TiledTemplate): void {
    this.sprite = new Sprite(template.tileset.tilesetAsset.imageAsset, template.tileset.tilesetAsset.GetTileRect(template.object.gid - 1));
  }
}