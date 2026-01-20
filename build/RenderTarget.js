import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { Camera } from "./Camera.js";
import { RawImage } from "./RawImage.js";
export class RenderTarget {
    canvas;
    context;
    pendingDrawTasks;
    texture;
    constructor(targetWidth, targetHeight, gl) {
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
        this.texture = gl.createTexture();
    }
    drawSprite(sprite, position, flipped) {
        let integerPosition = position.truncate();
        this.pendingDrawTasks.push((context, camera) => {
            let destX = integerPosition.x + camera.drawOffset.x;
            let destY = integerPosition.y + camera.drawOffset.y;
            context.save();
            if (flipped == true) {
                context.translate(destX + sprite.sourceRect.width / 2, destY + sprite.sourceRect.height / 2);
                context.scale(-1, 1);
                destX = -(sprite.sourceRect.width / 2);
                destY = -(sprite.sourceRect.height / 2);
            }
            context.drawImage(sprite.image, sprite.sourceRect.x, sprite.sourceRect.y, sprite.sourceRect.width, sprite.sourceRect.height, destX, destY, sprite.sourceRect.width, sprite.sourceRect.height);
            context.restore();
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
            context.font = "30px Arial";
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
    reset() {
        this.context.globalAlpha = 1;
        this.context.globalCompositeOperation = 'source-over';
        this.clearScreen();
        this.pendingDrawTasks = [];
    }
    bind(gl, slot) {
        gl.activeTexture(slot);
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, // Target
        0, // Mip level
        gl.RGBA, // Internal format
        gl.RGBA, // Format
        gl.UNSIGNED_BYTE, // Type
        this.canvas);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    }
}
//# sourceMappingURL=RenderTarget.js.map