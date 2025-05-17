import { RenderComponent } from "./RenderModule.js";
import { Sprite } from "./Sprite.js";
export class SpriteComponent extends RenderComponent {
    sprite;
    render(context) {
        context.drawSprite(this.sprite, this.parent.globalPosition);
    }
    initialize(engine, template) {
        this.sprite = new Sprite(template.tileset.tilesetAsset.imageAsset, template.tileset.tilesetAsset.getTileRect(template.object.gid - 1));
    }
}
//# sourceMappingURL=SpriteComponent.js.map