var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { componentType } from "./Component.js";
import { Rect } from "./Rect.js";
import { Component } from "./Component.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { AssetStore } from "./AssetStore.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { Array2D } from "./Array2D.js";
import { Point } from "./Point.js";
import { PropertyGrid } from "./Debugger.js";
import { Fluent } from "./Fluent.js";
import { TiledInlineTileset } from "./TiledInlineTileset.js";
let TilemapColliderComponent = class TilemapColliderComponent extends Component {
    tilemapComponent = undefined;
    cachedGrid = undefined;
    cachedOffset = undefined;
    cachedTileSize = undefined;
    initialize(engine, template, prototypeAsset) {
        console.log("Trace: TilemapColliderComponent.initialize");
        super.initialize(engine, template, prototypeAsset);
        this.tilemapComponent = this.parent?.getComponent(TilemapComponent);
    }
    createDebugger(name) {
        let grid = new PropertyGrid(this, name, ["cachedOffset", "cachedTileSize"]);
        return grid.getElement();
    }
    awake(engine) {
        console.log("Trace: TilemapColliderComponent.awake");
        if (this.tilemapComponent != undefined) {
            this.cachedGrid = this.tilemapComponent.fillArray(function (tileset, tile) { if (tileset == undefined || tile == undefined)
                return false;
            else
                return true; });
            this.cachedOffset = this.tilemapComponent.worldspaceOriginOffset;
            this.cachedTileSize = this.tilemapComponent.tileSize;
        }
        else {
            console.warn("TilemapCollider could not find Tilemap.");
        }
    }
    overlaps(rect) {
        // Calculate worldspace tilemap bounds.
        let worldSpaceTilemapBounds = new Rect((this.parent?.globalPosition.x ?? 0) + (this.cachedOffset?.x ?? 0), (this.parent?.globalPosition.y ?? 0) + (this.cachedOffset?.y ?? 0), (this.cachedGrid?.width ?? 0) * (this.cachedTileSize?.x ?? 1), (this.cachedGrid?.height ?? 0) * (this.cachedTileSize?.y ?? 1));
        if (worldSpaceTilemapBounds.overlaps(rect) == false)
            return false;
        // Convert rect to tile space.
        let tileSpaceOtherBounds = new Rect((rect.x - worldSpaceTilemapBounds.x), (rect.y - worldSpaceTilemapBounds.y), rect.width, rect.height);
        for (let x = Math.max(0, tileSpaceOtherBounds.x); x < Math.min(worldSpaceTilemapBounds.width, tileSpaceOtherBounds.x + tileSpaceOtherBounds.width); ++x) {
            for (let y = Math.max(0, tileSpaceOtherBounds.y); y < Math.min(worldSpaceTilemapBounds.height, tileSpaceOtherBounds.y + tileSpaceOtherBounds.height); ++y) {
                if (this.cachedGrid?.getValue(Math.floor(x / (this.cachedTileSize?.x ?? 1)), Math.floor(y / (this.cachedTileSize?.y ?? 1))) == true)
                    return true;
            }
        }
        return false;
    }
};
TilemapColliderComponent = __decorate([
    componentType("TilemapCollider")
], TilemapColliderComponent);
export { TilemapColliderComponent };
//# sourceMappingURL=TilemapColliderComponent.js.map