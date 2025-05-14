import { AssetReference } from "./AssetManagement/AssetReference.js";
import { RenderComponent } from "./RenderModule.js";
import { Point } from "./Point.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { RenderingContext} from "./RenderingContext.js";

export class TilemapComponent extends RenderComponent {
  public tilemapAsset: AssetReference;
  public tilemap: TiledTilemap;

  constructor(tilemapAsset: AssetReference) {
    super();
    this.tilemapAsset = tilemapAsset;
    this.tilemap = tilemapAsset.asset;
  }

  OnSpawn() {
    this.tilemap = this.tilemapAsset.asset as TiledTilemap;
  }

  public render(context: RenderingContext) {
    for (var layer of this.tilemap.layers) {
      var basePoint = this.transform.position;
      basePoint.x += layer.x;
      basePoint.y += layer.y;
      for (var x = 0; x < layer.width; ++x)
        for (var y = 0; y < layer.height; ++y)
        {
          var cellValue = layer.data[(y * layer.width) + x];
          if (cellValue == 0) continue;
          var cellRect = this.tilemap.tilesets[0].tilesetAsset.GetTileRect(cellValue - 1);
          var tilesetImage = this.tilemap.tilesets[0].tilesetAsset.imageAsset;
          context.DrawSpriteFromSourceRect(tilesetImage, cellRect, basePoint.Add(new Point(x * this.tilemap.tilewidth, y * this.tilemap.tileheight)));

        }
    }
  }

  public Clone() {
    return new TilemapComponent(this.tilemapAsset);
  }
}