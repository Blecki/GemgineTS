import { RenderComponent } from "./RenderModule.js";
import { Sprite } from "./Sprite.js";
export class SpriteComponent extends RenderComponent {
    sprite;
    Render(context) {
        context.DrawSprite(this.sprite, this.transform.position);
    }
    Initialize(engine, template) {
        this.sprite = new Sprite(template.tileset.tilesetAsset.imageAsset, template.tileset.tilesetAsset.GetTileRect(template.object.gid));
    }
}
//# sourceMappingURL=SpriteComponent.js.map