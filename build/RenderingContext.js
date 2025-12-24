import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { Camera } from "./Camera.js";
import { RawImage } from "./RawImage.js";
export class RenderingContext {
    canvas;
    context;
    pendingDrawTasks;
    constructor(targetWidth, targetHeight) {
        this.canvas = document.createElement('canvas');
        this.canvas.width = targetWidth;
        this.canvas.height = targetHeight;
        this.canvas.style.imageRendering = 'pixelated';
        let ctx = this.canvas.getContext('2d');
        if (ctx == null)
            throw new Error("Failed to get 2D context");
        this.context = ctx;
        this.context.imageSmoothingEnabled = false;
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
            context.fillRect(Math.floor(rect.x) + camera.drawOffset.x, Math.floor(rect.y) + camera.drawOffset.y, rect.width, rect.height);
        });
    }
    drawString(text, position, color) {
        this.pendingDrawTasks.push((context, camera) => {
            context.fillStyle = color;
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.fillText(text, position.x + camera.drawOffset.x, position.y + camera.drawOffset.y);
        });
    }
    drawLine(start, end, color) {
        this.pendingDrawTasks.push((context, camera) => {
            context.strokeStyle = color;
            context.beginPath();
            context.moveTo(start.x + camera.drawOffset.x, start.y + camera.drawOffset.y);
            context.lineTo(end.x + camera.drawOffset.x, end.y + camera.drawOffset.y);
            context.stroke();
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
    asRawImage() {
        return new RawImage(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data, this.canvas.width, this.canvas.height);
    }
    clearScreen() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}
//# sourceMappingURL=RenderingContext.js.map