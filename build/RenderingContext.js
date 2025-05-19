export class RenderingContext {
    canvas;
    context;
    pendingDrawTasks;
    constructor(canvas, context) {
        this.canvas = canvas;
        this.context = context;
        this.pendingDrawTasks = [];
    }
    drawSprite(sprite, position) {
        this.pendingDrawTasks.push((context, camera) => {
            context.drawImage(sprite.image, sprite.sourceRect.x, sprite.sourceRect.y, sprite.sourceRect.width, sprite.sourceRect.height, position.x - camera.position.x, position.y - camera.position.y, sprite.sourceRect.width, sprite.sourceRect.height);
        });
    }
    drawImage(image, sourceRect, position) {
        this.pendingDrawTasks.push((context, camera) => {
            context.drawImage(image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, position.x - camera.position.x, position.y - camera.position.y, sourceRect.width, sourceRect.height);
        });
    }
    drawRectangle(rect, color) {
        this.pendingDrawTasks.push((context, camera) => {
            context.fillStyle = color;
            context.fillRect(rect.x - camera.position.x, rect.y - camera.position.y, rect.width, rect.height);
        });
    }
    flush(camera) {
        for (let t of this.pendingDrawTasks)
            t(this.context, camera);
        this.pendingDrawTasks = [];
    }
    clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=RenderingContext.js.map