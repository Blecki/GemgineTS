import { RenderComponent } from "./RenderModule.js";
export class SpriteComponent extends RenderComponent {
    sprite;
    constructor(sprite) {
        super();
        this.sprite = sprite;
    }
    Render(context) {
        context.DrawSprite(this.sprite, this.transform.position);
    }
    Clone() {
        return new SpriteComponent(this.sprite);
    }
}
//# sourceMappingURL=SpriteComponent.js.map