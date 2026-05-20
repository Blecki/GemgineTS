import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { Camera } from "./Camera.js";
import { RawImage } from "./RawImage.js";
import { generateBezierPoints } from "./Bezier.js";
export class RenderTarget2D {
    canvas;
    context;
    pendingDrawTasks;
    texture = null;
    constructor(first, second, third) {
        if (typeof (first) === "object")
            this.canvas = first;
        else {
            this.canvas = document.createElement('canvas');
            this.canvas.width = first;
            this.canvas.height = second ?? first;
        }
        this.canvas.style.imageRendering = 'pixelated';
        let ctx = this.canvas.getContext('2d');
        if (ctx == null)
            throw new Error("Failed to get 2D context");
        this.context = ctx;
        this.context.imageSmoothingEnabled = false;
        this.pendingDrawTasks = [];
        if (third != null && third != undefined)
            this.texture = third.createTexture();
    }
    drawSprite(sprite, position, flipped) {
        this.pendingDrawTasks.push((context) => {
            let dest = new Rect(position.x, position.y, sprite.sourceRect.width, sprite.sourceRect.height);
            context.save();
            if (flipped == true) {
                context.translate(dest.x + sprite.sourceRect.width / 2, dest.y + sprite.sourceRect.height / 2);
                context.scale(-1, 1);
                dest.x = -(dest.width / 2);
                dest.y = -(dest.height / 2);
            }
            context.drawImage(sprite.image, sprite.sourceRect.x, sprite.sourceRect.y, sprite.sourceRect.width, sprite.sourceRect.height, dest.x, dest.y, dest.width, dest.height);
            context.restore();
        });
    }
    drawImage(image, sourceRect, position) {
        this.pendingDrawTasks.push((context) => {
            let dest = new Rect(position.x, position.y, sourceRect.width, sourceRect.height);
            context.drawImage(image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, dest.x, dest.y, dest.width, dest.height);
        });
    }
    drawImageDR(image, sourceRect, position) {
        this.pendingDrawTasks.push((context) => {
            context.globalCompositeOperation = 'source-over';
            context.drawImage(image, sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height, position.x, position.y, position.width, position.height);
        });
    }
    drawRectangle(rect, color) {
        this.pendingDrawTasks.push((context) => {
            context.fillStyle = color;
            context.fillRect(rect.x, rect.y, rect.width, rect.height);
        });
    }
    drawWireRectangle(rect, color) {
        this.pendingDrawTasks.push((context) => {
            context.strokeStyle = color;
            context.strokeRect(rect.x, rect.y, rect.width, rect.height);
        });
    }
    drawString(text, position, color) {
        this.pendingDrawTasks.push((context) => {
            context.fillStyle = color;
            context.textAlign = 'left';
            context.textBaseline = 'top';
            context.font = "24px Pixelify Sans";
            context.fillText(text, position.x, position.y);
        });
    }
    drawLine(start, end, color) {
        this.pendingDrawTasks.push((context) => {
            context.strokeStyle = color;
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
        });
    }
    drawLineWidth(start, end, color, width) {
        this.pendingDrawTasks.push((context) => {
            context.strokeStyle = color;
            context.lineWidth = width;
            context.beginPath();
            context.moveTo(start.x, start.y);
            context.lineTo(end.x, end.y);
            context.stroke();
            context.lineWidth = 1;
        });
    }
    drawCurveWidth(start, control1, control2, end, color, width) {
        this.pendingDrawTasks.push((context) => {
            let points = generateBezierPoints(start, control1, control2, end, 16);
            context.strokeStyle = color;
            context.lineWidth = width;
            context.beginPath();
            context.moveTo(start.x, start.y);
            for (let i = 0; i < points.length; ++i)
                context.lineTo(points[i].x, points[i].y);
            context.stroke();
            context.lineWidth = 1;
        });
    }
    drawCustom(drawtask) {
        this.pendingDrawTasks.push(drawtask);
    }
    flush(camera) {
        this.context.save();
        this.context.globalAlpha = 1;
        this.context.globalCompositeOperation = 'source-over';
        this.context.save();
        this.context.translate(this.canvas.width / 2, this.canvas.height / 2);
        this.context.scale(camera.scale.x, camera.scale.y);
        this.context.translate(-camera.position.x, -camera.position.y);
        for (let t of this.pendingDrawTasks)
            t(this.context);
        this.pendingDrawTasks = [];
        this.context.restore();
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
        //this.pendingDrawTasks = [];
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
//# sourceMappingURL=RenderTarget2D.js.map