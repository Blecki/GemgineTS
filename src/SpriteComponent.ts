import { Engine } from "./Engine.js";
import { RenderingContext } from "./RenderingContext.js";
import { Sprite } from "./Sprite.js";
import { TiledTemplate } from "./Tiled/TiledTemplate.js";
import { RenderComponent } from "./RenderModule.js";
import { componentType } from "./Component.js";
import { RenderLayers } from "./RenderLayers.js";

@componentType("Sprite")
export class SpriteComponent extends RenderComponent {
  public sprite: Sprite | null = null;
  
  public render(context: RenderingContext) {
    if (this.sprite != null)
      context.drawSprite(this.sprite, this.parent.globalPosition.sub(this.parent.pivot));
  }

  public initialize(engine: Engine, template: TiledTemplate): void {
    this.renderLayer = RenderLayers.Objects;
    if (template?.tileset?.tilesetAsset?.imageAsset == undefined || template?.object?.gid == undefined) return;
    this.sprite = new Sprite(template.tileset.tilesetAsset.imageAsset, template.tileset.tilesetAsset.getTileRect(template.object.gid - 1));
  }
}