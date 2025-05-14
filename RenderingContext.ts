import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";

export class RenderingContext {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;
  }

  public DrawSprite(sprite: Sprite, position: Point) {
    this.context.drawImage(
      sprite.asset.asset, 
      sprite.sourceRect.x,
      sprite.sourceRect.y,
      sprite.sourceRect.width,
      sprite.sourceRect.height,
      position.x,
      position.y,
      sprite.sourceRect.width,
      sprite.sourceRect.height);
  }
  
  public DrawSpriteFromSourceRect(image: ImageBitmap, rect: Rect, position: Point) {
    this.context.drawImage(
      image,
      rect.x,
      rect.y,
      rect.width,
      rect.height,
      position.x,
      position.y,
      rect.width,
      rect.height);
  }

  public ClearScreen() {
    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }
}
