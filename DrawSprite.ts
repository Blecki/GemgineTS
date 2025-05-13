import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";

export function DrawSprite(context: CanvasRenderingContext2D, sprite: Sprite, position: Point) {
  context.drawImage(
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