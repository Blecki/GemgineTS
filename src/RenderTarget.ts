import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { Camera } from "./Camera.js";
import { RawImage } from "./RawImage.js";

type DrawTask = (context: CanvasRenderingContext2D, camera: Camera) => void;

export class RenderTarget {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  private pendingDrawTasks: DrawTask[];
  private texture: WebGLTexture | null = null;


  constructor(canvas: HTMLCanvasElement);
  constructor(targetWidth: number, targetHeight: number, gl: WebGLRenderingContext | null);
  constructor(first: HTMLCanvasElement | number, second?: number, third?: WebGLRenderingContext | null) {
    if (typeof(first) === "object")
      this.canvas = first as HTMLCanvasElement;
    else {
      this.canvas = document.createElement('canvas');
      this.canvas.width = first as number;
      this.canvas.height = second ?? (first as number);
    }
    this.canvas.style.imageRendering = 'pixelated';

    let ctx = this.canvas.getContext('2d');
    if (ctx == null) throw new Error("Failed to get 2D context");
    this.context = ctx;
    this.context.imageSmoothingEnabled = false;
    
    this.pendingDrawTasks = [];

    if (third != null && third != undefined) 
      this.texture = third.createTexture();
  }

  public drawSprite(sprite: Sprite, position: Point, flipped?: boolean) {
    this.pendingDrawTasks.push((context, camera) => { 
      let dest = camera.worldRectToScreen(new Rect(position.x, position.y,  sprite.sourceRect.width, sprite.sourceRect.height));

      context.save();

      if (flipped == true) {
        context.translate(dest.x + sprite.sourceRect.width / 2, dest.y + sprite.sourceRect.height / 2);
        context.scale(-1, 1);
        dest.x = -(dest.width / 2);
        dest.y = -(dest.height / 2);
      }

      context.drawImage(sprite.image,
        sprite.sourceRect.x, sprite.sourceRect.y, sprite.sourceRect.width, sprite.sourceRect.height,
        dest.x, dest.y, dest.width, dest.height); 
      
      context.restore();
    });
  }
  
  public drawImage(image: ImageBitmap | OffscreenCanvas, sourceRect: Rect, position: Point) {
    this.pendingDrawTasks.push((context, camera) => { 
      let dest = camera.worldRectToScreen(new Rect(position.x, position.y, sourceRect.width, sourceRect.height));
      context.drawImage(image, 
        sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height,
        dest.x, dest.y, dest.width, dest.height); 
    });
  }

  public drawRectangle(rect: Rect, color: string) {
    this.pendingDrawTasks.push((context, camera) => {
      let dest = camera.worldRectToScreen(rect);
      context.fillStyle = color;
      context.fillRect(dest.x, dest.y, dest.width, dest.height);
    });
  }

  public drawWireRectangle(rect: Rect, color: string) {
    this.pendingDrawTasks.push((context, camera) => {
      let dest = camera.worldRectToScreen(rect);
      context.strokeStyle = color;
      context.strokeRect(dest.x, dest.y, dest.width, dest.height);
    });
  }

  public drawString(text: string, position: Point, color: string) {
    this.pendingDrawTasks.push((context, camera) => {
      context.fillStyle = color;
      context.textAlign = 'left';
      context.textBaseline = 'top';
      context.font = "30px Arial";
      let dest = camera.worldPointToScreen(position);
      context.fillText(text, dest.x, dest.y);
    });
  }

  public drawLine(start: Point, end: Point, color: string) {
    this.pendingDrawTasks.push((context, camera) => {
      let _start = camera.worldPointToScreen(start);
      let _end = camera.worldPointToScreen(end);
     context.strokeStyle = color;
      context.beginPath();
      context.moveTo(_start.x, _start.y);
      context.lineTo(_end.x, _end.y);
      context.stroke();
    });
  }

  public flush(camera: Camera) {
    this.context.save();
    this.context.globalAlpha = 1;
    this.context.globalCompositeOperation = 'source-over';
          
    for (let t of this.pendingDrawTasks)
      t(this.context, camera);
    this.pendingDrawTasks = [];

    this.context.restore();
  }

  public asRawImage() : RawImage {
    return new RawImage(this.context.getImageData(0, 0, this.canvas.width, this.canvas.height).data, this.canvas.width, this.canvas.height);
  }

  public clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  public reset() {
    this.context.globalAlpha = 1;
    this.context.globalCompositeOperation = 'source-over';
    this.clearScreen();
    this.pendingDrawTasks = [];
  }

  public bind(gl: WebGLRenderingContext, slot: GLenum): void {
    gl.activeTexture(slot);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D, // Target
      0,             // Mip level
      gl.RGBA,       // Internal format
      gl.RGBA,       // Format
      gl.UNSIGNED_BYTE, // Type
      this.canvas);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }    
}
