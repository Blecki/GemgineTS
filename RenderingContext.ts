import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { Camera } from "./Camera.js";

type DrawTask = (context: CanvasRenderingContext2D, camera: Camera) => void;

export class RenderingContext {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  private pendingDrawTasks: DrawTask[];

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.pendingDrawTasks = [];
  }

  public drawSprite(sprite: Sprite, position: Point) {
    this.pendingDrawTasks.push((context, camera) => { 
      context.drawImage(sprite.image, 
        sprite.sourceRect.x, sprite.sourceRect.y, sprite.sourceRect.width, sprite.sourceRect.height,
        position.x - camera.position.x, 
        position.y - camera.position.y, 
        sprite.sourceRect.width, sprite.sourceRect.height); 
    });
  }
  
  public drawImage(image: ImageBitmap | OffscreenCanvas, sourceRect: Rect, position: Point) {
    this.pendingDrawTasks.push((context, camera) => { 
      context.drawImage(image, 
        sourceRect.x, sourceRect.y, sourceRect.width, sourceRect.height,
        position.x - camera.position.x, 
        position.y - camera.position.y, 
        sourceRect.width, sourceRect.height); 
    });
  }

  public drawRectangle(rect: Rect, color: string) {
    this.pendingDrawTasks.push((context, camera) => {
      context.fillStyle = color;
      context.fillRect(rect.x - camera.position.x, rect.y - camera.position.y, rect.width, rect.height);
    });
  }
  
  public flush(camera: Camera) {
    for (var t of this.pendingDrawTasks)
      t(this.context, camera);
    this.pendingDrawTasks = [];
  }

  public clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
