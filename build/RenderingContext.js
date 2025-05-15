export class RenderingContext {
    canvas;
    context;
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
    }
    DrawSprite(sprite, position) {
        this.context.drawImage(sprite.image, sprite.sourceRect.x, sprite.sourceRect.y, sprite.sourceRect.width, sprite.sourceRect.height, position.x, position.y, sprite.sourceRect.width, sprite.sourceRect.height);
    }
    DrawSpriteFromSourceRect(image, rect, position) {
        this.context.drawImage(image, rect.x, rect.y, rect.width, rect.height, position.x, position.y, rect.width, rect.height);
    }
    ClearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=RenderingContext.js.map