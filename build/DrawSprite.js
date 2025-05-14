export function DrawSprite(context, sprite, position) {
    context.drawImage(sprite.asset.asset, sprite.sourceRect.x, sprite.sourceRect.y, sprite.sourceRect.width, sprite.sourceRect.height, position.x, position.y, sprite.sourceRect.width, sprite.sourceRect.height);
}
//# sourceMappingURL=DrawSprite.js.map