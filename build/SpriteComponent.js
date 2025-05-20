import { Sprite } from "./Sprite.js";
import { RenderComponent } from "./RenderModule.js";
export class SpriteComponent extends RenderComponent {
    sprite;
    render(context) {
        context.drawSprite(this.sprite, this.parent.globalPosition.sub(this.parent.pivot));
    }
    initialize(engine, template) {
        this.sprite = new Sprite(template.tileset.tilesetAsset.imageAsset, template.tileset.tilesetAsset.getTileRect(template.object.gid - 1));
        this.renderLayer = 1;
    }
}
//# sourceMappingURL=SpriteComponent.js.map