import { AssetReference } from "./AssetReference.js";
import { RenderComponent } from "./RenderModule.js";
import { Point } from "./Point.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { RenderingContext} from "./RenderingContext.js";
import { Engine } from "./Engine.js";
import { TiledTemplate } from "./TiledTemplate.js";

export class TilemapComponent extends RenderComponent {
  public tilemapName: string;
  public tilemapAsset: AssetReference;
  private tilemap: TiledTilemap;

  public initialize(engine: Engine, template: TiledTemplate) {
    this.tilemapAsset = engine.assetMap.get(this.tilemapName);
    this.tilemap = this.tilemapAsset.asset as TiledTilemap;
  }

  public render(context: RenderingContext) {
    for (var layer of this.tilemap.layers) {
      if (layer.type != "tilelayer") continue;
      var basePoint = this.parent.position;
      basePoint.x += layer.x;
      basePoint.y += layer.y;
      for (var x = 0; x < layer.width; ++x)
        for (var y = 0; y < layer.height; ++y)
        {
          var cellValue = layer.data[(y * layer.width) + x];
          if (cellValue == 0) continue;
          var cellRect = this.tilemap.tilesets[0].tilesetAsset.getTileRect(cellValue - 1);
          var tilesetImage = this.tilemap.tilesets[0].tilesetAsset.imageAsset;
          context.drawSpriteFromSourceRect(tilesetImage, cellRect, basePoint.add(new Point(x * this.tilemap.tilewidth, y * this.tilemap.tileheight)));
        }
    }
  }
}