import { Point } from "./Point.js";
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
        let integerPosition = position.truncate();
        this.pendingDrawTasks.push((context, camera) => {
            context.drawImage(sprite.image, sprite.sourceRect.x, sprite.sourceRect.y, sprite.sourceRect.width, sprite.sourceRect.height, integerPosition.x + camera.drawOffset.x, integerPosition.y + camera.drawOffset.y, sprite.sourceRect.width, sprite.sourceRect.height);
        });
    }
    drawImage(image, sourceRect, position) {
        let integerPosition = position.truncate();
        this.pendingDrawTasks.push((context, camera) => {
            context.drawImage(image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, integerPosition.x + camera.drawOffset.x, integerPosition.y + camera.drawOffset.y, sourceRect.width, sourceRect.height);
        });
    }
    drawRectangle(rect, color) {
        this.pendingDrawTasks.push((context, camera) => {
            context.fillStyle = color;
            context.fillRect(rect.x + camera.drawOffset.x, rect.y + camera.drawOffset.y, rect.width, rect.height);
        });
    }
    flush(camera) {
        this.context.globalAlpha = 1;
        this.context.globalCompositeOperation = 'source-over';
        let halfOffset = new Point(this.canvas.width / 2, this.canvas.height / 2);
        camera.drawOffset = camera.position.negate().add(halfOffset).truncate();
        for (let t of this.pendingDrawTasks)
            t(this.context, camera);
        this.pendingDrawTasks = [];
    }
    clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=RenderingContext.js.map