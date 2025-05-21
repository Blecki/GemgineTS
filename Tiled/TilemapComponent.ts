import { Rect } from "../Rect.js";
import { Point } from "../Point.js";
import { TiledTilemap, TiledLayer, TiledInlineTileset } from "./TiledTilemap.js";
import { RenderingContext} from "../RenderingContext.js";
import { CacheState } from "../CacheState.js";
import { Engine } from "../Engine.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { RenderComponent } from "../RenderModule.js";
import { componentType } from "../Component.js";

@componentType("Tilemap")
export class TilemapComponent extends RenderComponent {
  public layer: TiledLayer;
  public tilemap: TiledTilemap;
  private cacheState: CacheState = CacheState.Empty;
  private cachedCanvas: OffscreenCanvas;
  private cachedRender: ImageBitmap;

  public initialize(engine: Engine, template: TiledTemplate) {
    this.parent.size = new Point(this.layer.width * this.tilemap.tilewidth, this.layer.height * this.tilemap.tileheight);
  }  

  private getTile(tilemap: TiledTilemap, tile: number): [tileset: TiledInlineTileset, tile: number]  {
    for (let i = tilemap.tilesets.length - 1; i >= 0; i--) {
      if (tile > tilemap.tilesets[i].firstgid) return [tilemap.tilesets[i], tile - tilemap.tilesets[i].firstgid];
    }
    return [tilemap.tilesets[0], tile];
  }

  private updateCache() {
    this.cacheState = CacheState.Priming;

    const canvasDims = new Point(this.layer.width * this.tilemap.tilewidth, this.layer.height * this.tilemap.tileheight);
    this.cachedCanvas = new OffscreenCanvas(canvasDims.x, canvasDims.y);
    let context = this.cachedCanvas.getContext('2d');
    
    for (let x = 0; x < this.layer.width; ++x) {
      for (let y = 0; y < this.layer.height; ++y)
      {
        let cellValue = this.layer.data[(y * this.layer.width) + x];
        if (cellValue == 0) continue;
        let [tileset, tile] = this.getTile(this.tilemap, cellValue);
        let cellRect = tileset.tilesetAsset.getTileRect(tile); 
        context.drawImage(tileset.tilesetAsset.imageAsset,
          cellRect.x, cellRect.y, cellRect.width, cellRect.height,
          x * this.tilemap.tilewidth, y * this.tilemap.tileheight,
          this.tilemap.tilewidth, this.tilemap.tileheight);
      }
    }

    createImageBitmap(this.cachedCanvas).then(bitmap => {
      this.cachedRender = bitmap;
      this.cacheState = CacheState.Ready;
    });
  }

  public render(context: RenderingContext) {
    if (this.cacheState == CacheState.Empty)
      this.updateCache();
    let basePoint = this.parent.globalPosition;
    basePoint.x += this.layer.x;
    basePoint.y += this.layer.y;
    if (this.cacheState == CacheState.Priming)
      context.drawImage(this.cachedCanvas, new Rect(0, 0, this.cachedCanvas.width, this.cachedCanvas.height), basePoint);
    else if (this.cacheState == CacheState.Ready)
      context.drawImage(this.cachedRender, new Rect(0, 0, this.cachedCanvas.width, this.cachedCanvas.height), basePoint);
  }
}