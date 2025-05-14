import { RenderComponent } from "./RenderModule.js";
import { Point } from "./Point.js";
export class TilemapComponent extends RenderComponent {
    tilemapAsset;
    tilemap;
    constructor(tilemapAsset) {
        super();
        this.tilemapAsset = tilemapAsset;
        this.tilemap = tilemapAsset.asset;
    }
    OnSpawn() {
        this.tilemap = this.tilemapAsset.asset;
    }
    render(context) {
        for (var layer of this.tilemap.layers) {
            var basePoint = this.transform.position;
            basePoint.x += layer.x;
            basePoint.y += layer.y;
            for (var x = 0; x < layer.width; ++x)
                for (var y = 0; y < layer.height; ++y) {
                    var cellValue = layer.data[(y * layer.width) + x];
                    if (cellValue == 0)
                        continue;
                    var cellRect = this.tilemap.tilesets[0].tilesetAsset.GetTileRect(cellValue - 1);
                    var tilesetImage = this.tilemap.tilesets[0].tilesetAsset.imageAsset;
                    context.DrawSpriteFromSourceRect(tilesetImage, cellRect, basePoint.Add(new Point(x * this.tilemap.tilewidth, y * this.tilemap.tileheight)));
                }
        }
    }
    Clone() {
        return new TilemapComponent(this.tilemapAsset);
    }
}
//# sourceMappingURL=TilemapComponent.js.map