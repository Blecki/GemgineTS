var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Rect } from "../Rect.js";
import { Point } from "../Point.js";
import { CacheState } from "../CacheState.js";
import { RenderComponent } from "../RenderModule.js";
import { componentType } from "../Component.js";
let TilemapComponent = (() => {
    let _classDecorators = [componentType("Tilemap")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = RenderComponent;
    var TilemapComponent = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            TilemapComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        layer = undefined;
        tilemap = undefined;
        cacheState = CacheState.Empty;
        cachedCanvas = undefined;
        cachedRender = undefined;
        initialize(engine, template) {
            this.parent.size = new Point((this.layer?.width ?? 1) * (this.tilemap?.tilewidth ?? 16), (this.layer?.height ?? 1) * (this.tilemap?.tileheight ?? 16));
        }
        getTile(tilemap, tile) {
            if (tilemap.tilesets == undefined)
                return [null, 0];
            for (let i = tilemap.tilesets.length - 1; i >= 0; i--) {
                if (tile > (tilemap.tilesets[i].firstgid ?? 0))
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
            let basePoint = this.parent.globalPosition;
            basePoint.x += this.layer?.x ?? 0;
            basePoint.y += this.layer?.y ?? 0;
            if (this.cacheState == CacheState.Priming && this.cachedCanvas != null)
                context.drawImage(this.cachedCanvas, new Rect(0, 0, this.cachedCanvas.width, this.cachedCanvas.height), basePoint);
            else if (this.cacheState == CacheState.Ready && this.cachedRender != null)
                context.drawImage(this.cachedRender, new Rect(0, 0, this.cachedRender.width, this.cachedRender.height), basePoint);
        }
    };
    return TilemapComponent = _classThis;
})();
export { TilemapComponent };
//# sourceMappingURL=TilemapComponent.js.map