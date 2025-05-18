import { Rect } from "./Rect.js";
import { RenderComponent } from "./RenderModule.js";
import { Point } from "./Point.js";
import { CacheState } from "./CacheState.js";
export class TilemapComponent extends RenderComponent {
    layer;
    tilemap;
    cacheState = CacheState.Empty;
    cachedCanvas;
    cachedRender;
    initialize(engine, template) {
    }
    updateCache() {
        this.cacheState = CacheState.Priming;
        var canvasDims = new Point(this.layer.width * this.tilemap.tilewidth, this.layer.height * this.tilemap.tileheight);
        this.cachedCanvas = new OffscreenCanvas(canvasDims.x, canvasDims.y);
        var context = this.cachedCanvas.getContext('2d');
        for (var x = 0; x < this.layer.width; ++x)
            for (var y = 0; y < this.layer.height; ++y) {
                var cellValue = this.layer.data[(y * this.layer.width) + x];
                if (cellValue == 0)
                    continue;
                var cellRect = this.tilemap.tilesets[0].tilesetAsset.getTileRect(cellValue - 1); // Todo: Actually get the correct tile when there are multiple tilesets.
                var tilesetImage = this.tilemap.tilesets[0].tilesetAsset.imageAsset;
                context.drawImage(tilesetImage, cellRect.x, cellRect.y, cellRect.width, cellRect.height, x * this.tilemap.tilewidth, y * this.tilemap.tileheight, this.tilemap.tilewidth, this.tilemap.tileheight);
            }
        createImageBitmap(this.cachedCanvas).then(bitmap => {
            this.cachedRender = bitmap;
            this.cacheState = CacheState.Ready;
            //this.cachedCanvas = null;
        });
    }
    render(context) {
        if (this.cacheState == CacheState.Empty)
            this.updateCache();
        var basePoint = this.parent.globalPosition;
        basePoint.x += this.layer.x;
        basePoint.y += this.layer.y;
        if (this.cacheState == CacheState.Priming)
            context.drawImage(this.cachedCanvas, new Rect(0, 0, this.cachedCanvas.width, this.cachedCanvas.height), basePoint);
        else if (this.cacheState == CacheState.Ready)
            context.drawImage(this.cachedRender, new Rect(0, 0, this.cachedCanvas.width, this.cachedCanvas.height), basePoint);
    }
}
//# sourceMappingURL=TilemapComponent.js.map