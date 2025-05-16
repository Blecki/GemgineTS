import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { Camera } from "./Camera.js";

class PendingSprite {
  public image: ImageBitmap;
  public position: Point;
  public sourceRect: Rect;
  public sortY: number;

  constructor(image: ImageBitmap, position: Point, sourceRect: Rect, sortY: number) {
    this.image = image;
    this.position = position;
    this.sourceRect = sourceRect;
    this.sortY = sortY;
  }
}

export class RenderingContext {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;
  private pendingSprites: PendingSprite[];

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
    this.pendingSprites = [];
  }

  public drawSprite(sprite: Sprite, position: Point) {
    this.pendingSprites.push(new PendingSprite(sprite.image, position, sprite.sourceRect, 1));
  }
  
  public drawSpriteFromSourceRect(image: ImageBitmap, rect: Rect, position: Point) {
    this.pendingSprites.push(new PendingSprite(image, position, rect, 1));
  }

  public flushSprites(camera: Camera) {
    for (var s of this.pendingSprites)
      this.context.drawImage(
        s.image, 
        s.sourceRect.x, s.sourceRect.y, s.sourceRect.width, s.sourceRect.height, 
        s.position.x - camera.position.x, 
        s.position.y - camera.position.y, 
        s.sourceRect.width, s.sourceRect.height);
    this.pendingSprites = [];
  }

  public clearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
