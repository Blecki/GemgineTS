var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Rect } from "./Rect.js";
import { Point } from "./Point.js";
import { TiledTilemap, TiledLayer } from "./TiledTilemap.js";
import { RenderContext } from "./RenderContext.js";
import { CacheState } from "./CacheState.js";
import { Engine } from "./Engine.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { RenderComponent } from "./RenderModule.js";
import { componentType } from "./Component.js";
import { Array2D } from "./Array2D.js";
import { RenderLayersMapping } from "./RenderLayers.js";
import { PropertyGrid } from "./Debugger.js";
import {} from "./Fluent.js";
import { TiledInlineTileset } from "./TiledInlineTileset.js";
let TilemapComponent = class TilemapComponent extends RenderComponent {
    layer;
    tilemap;
    cacheState = CacheState.Empty;
    cachedCanvas = undefined;
    cachedRender = undefined;
    worldspaceOriginOffset = undefined;
    tileSize = undefined;
    createDebugger(name) {
        let grid = new PropertyGrid(this, name, ["layer", "tilemap", "worldspaceOriginOffset", "tileSize", "renderLayer"]);
        return grid.getElement();
    }
    constructor(prototype) {
        super(prototype);
        let p = prototype;
        this.layer = p?.layer ?? new TiledLayer();
        this.tilemap = p?.tilemap ?? new TiledTilemap();
        this.worldspaceOriginOffset = new Point(this.layer?.x ?? 0, this.layer?.y ?? 0);
        this.renderLayer = RenderLayersMapping[p?.layer.properties.filter(p => p.name == "Layer")[0].value];
    }
    initialize(engine, template) {
        this.tileSize = new Point(this.tilemap.tilewidth, this.tilemap.tileheight);
    }
    getTile(tilemap, tile) {
        if (tilemap.tilesets == undefined)
            return [null, 0];
        for (let i = tilemap.tilesets.length - 1; i >= 0; i--) {
            if (tile >= (tilemap.tilesets[i].firstgid ?? 0))
                return [tilemap.tilesets[i], tile - (tilemap.tilesets[i].firstgid ?? 0)];
        }
        return [tilemap?.tilesets[0], tile];
    }
    updateCache() {
        if (this.layer == undefined || this.tilemap == undefined)
            return;
        this.cacheState = CacheState.Priming;
        const canvasDims = new Point((this.layer.width ?? 1) * (this.tilemap.tilewidth ?? 16), (this.layer.height ?? 1) * (this.tilemap.tileheight ?? 16));
        this.cachedCanvas = new OffscreenCanvas(canvasDims.x, canvasDims.y);
        let context = this.cachedCanvas.getContext('2d');
        if (context == null)
            return;
        for (let x = 0; x < (this.layer.width ?? 1); ++x) {
            for (let y = 0; y < (this.layer.height ?? 1); ++y) {
                let cellValue = 0;
                if (this.layer.data != undefined)
                    cellValue = this.layer.data[(y * (this.layer.width ?? 1)) + x] ?? 0;
                if (cellValue == 0)
                    continue;
                let [tileset, tile] = this.getTile(this.tilemap, cellValue);
                let cellRect = tileset?.tilesetAsset?.getTileRect(tile ?? 0);
                if (cellRect == null)
                    continue;
                if (tileset?.tilesetAsset?.imageAsset == null)
                    continue;
                context.drawImage(tileset.tilesetAsset?.imageAsset, cellRect.x, cellRect.y, cellRect.width, cellRect.height, x * (this.tilemap.tilewidth ?? 16), y * (this.tilemap.tileheight ?? 16), (this.tilemap.tilewidth ?? 16), (this.tilemap.tileheight ?? 16));
            }
        }
        createImageBitmap(this.cachedCanvas).then(bitmap => {
            this.cachedRender = bitmap;
            this.cacheState = CacheState.Ready;
        });
    }
    render(context) {
        if (this.cacheState == CacheState.Empty)
            this.updateCache();
        if (this.parent != null) {
            let basePoint = this.parent.globalPosition;
            basePoint.x += this.layer?.x ?? 0;
            basePoint.y += this.layer?.y ?? 0;
            if (this.cacheState == CacheState.Priming && this.cachedCanvas != null)
                context.getTarget(this.renderLayer).drawImage(this.cachedCanvas, new Rect(0, 0, this.cachedCanvas.width, this.cachedCanvas.height), basePoint);
            else if (this.cacheState == CacheState.Ready && this.cachedRender != null)
                context.getTarget(this.renderLayer).drawImage(this.cachedRender, new Rect(0, 0, this.cachedRender.width, this.cachedRender.height), basePoint);
        }
    }
    fillArray(callback) {
        let r = new Array2D(this.layer?.width ?? 1, this.layer?.height ?? 1);
        for (let x = 0; x < (this.layer?.width ?? 1); ++x) {
            for (let y = 0; y < (this.layer?.height ?? 1); ++y) {
                let cellValue = 0;
                if (this.layer?.data != undefined)
                    cellValue = this.layer.data[(y * (this.layer.width ?? 1)) + x] ?? 0;
                if (cellValue == 0 || this.tilemap == undefined)
                    r.setValue(x, y, callback(null, null));
                else {
                    let [tileset, tile] = this.getTile(this.tilemap, cellValue);
                    r.setValue(x, y, callback(tileset, tile));
                }
            }
        }
        return r;
    }
};
TilemapComponent = __decorate([
    componentType("Tilemap"),
    __metadata("design:paramtypes", [Object])
], TilemapComponent);
export { TilemapComponent };
//# sourceMappingURL=TilemapComponent.js.map