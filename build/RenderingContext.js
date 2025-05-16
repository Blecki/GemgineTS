class PendingSprite {
    image;
    position;
    sourceRect;
    sortY;
    constructor(image, position, sourceRect, sortY) {
        this.image = image;
        this.position = position;
        this.sourceRect = sourceRect;
        this.sortY = sortY;
    }
}
export class RenderingContext {
    canvas;
    context;
    pendingSprites;
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.pendingSprites = [];
    }
    drawSprite(sprite, position) {
        this.pendingSprites.push(new PendingSprite(sprite.image, position, sprite.sourceRect, 1));
    }
    drawSpriteFromSourceRect(image, rect, position) {
        this.pendingSprites.push(new PendingSprite(image, position, rect, 1));
    }
    flushSprites(camera) {
        for (var s of this.pendingSprites)
            this.context.drawImage(s.image, s.sourceRect.x, s.sourceRect.y, s.sourceRect.width, s.sourceRect.height, s.position.x - camera.position.x, s.position.y - camera.position.y, s.sourceRect.width, s.sourceRect.height);
        this.pendingSprites = [];
    }
    clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=RenderingContext.js.map