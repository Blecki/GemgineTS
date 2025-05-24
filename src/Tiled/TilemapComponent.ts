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
  public layer: TiledLayer | undefined = undefined;
  public tilemap: TiledTilemap | undefined = undefined;
  private cacheState: CacheState = CacheState.Empty;
  private cachedCanvas: OffscreenCanvas | undefined = undefined;
  private cachedRender: ImageBitmap | undefined = undefined;

  public initialize(engine: Engine, template: TiledTemplate) {
    this.parent.size = new Point((this.layer?.width ?? 1) * (this.tilemap?.tilewidth ?? 16), (this.layer?.height ?? 1) * (this.tilemap?.tileheight ?? 16));
  }  

  private getTile(tilemap: TiledTilemap, tile: number): [tileset: TiledInlineTileset | null, tile: number | null]  {
    if (tilemap.tilesets == undefined) return [null, 0];
    for (let i = tilemap.tilesets.length - 1; i >= 0; i--) {
      if (tile > (tilemap.tilesets[i].firstgid ?? 0)) return [tilemap.tilesets[i], tile - (tilemap.tilesets[i].firstgid ?? 0)];
    }
    return [tilemap?.tilesets[0], tile];
  }

  private updateCache(): void {
    if (this.layer == undefined || this.tilemap == undefined) return;
    this.cacheState = CacheState.Priming;

    const canvasDims = new Point((this.layer.width ?? 1) * (this.tilemap.tilewidth ?? 16), (this.layer.height ?? 1) * (this.tilemap.tileheight ?? 16));
    this.cachedCanvas = new OffscreenCanvas(canvasDims.x, canvasDims.y);
    let context = this.cachedCanvas.getContext('2d');
    if (context == null) return;
    
    for (let x = 0; x < (this.layer.width ?? 1); ++x) {
      for (let y = 0; y < (this.layer.height ?? 1); ++y)
      {
        let cellValue = 0;
        if (this.layer.data != undefined) cellValue = this.layer.data[(y * (this.layer.width ?? 1)) + x] ?? 0;
        if (cellValue == 0) continue;
        let [tileset, tile] = this.getTile(this.tilemap, cellValue);
        let cellRect = tileset?.tilesetAsset?.getTileRect(tile ?? 0); 
        if (cellRect == null) continue;
        if (tileset?.tilesetAsset?.imageAsset == null) continue;
        context.drawImage(tileset.tilesetAsset?.imageAsset,
          cellRect.x, cellRect.y, cellRect.width, cellRect.height,
          x * (this.tilemap.tilewidth ?? 16), y * (this.tilemap.tileheight ?? 16),
          (this.tilemap.tilewidth ?? 16), (this.tilemap.tileheight ?? 16));
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
    basePoint.x += this.layer?.x ?? 0;
    basePoint.y += this.layer?.y ?? 0;

    if (this.cacheState == CacheState.Priming && this.cachedCanvas != null)
      context.drawImage(this.cachedCanvas, new Rect(0, 0, this.cachedCanvas.width, this.cachedCanvas.height), basePoint);
    else if (this.cacheState == CacheState.Ready && this.cachedRender != null)
      context.drawImage(this.cachedRender, new Rect(0, 0, this.cachedRender.width, this.cachedRender.height), basePoint);
  }
}