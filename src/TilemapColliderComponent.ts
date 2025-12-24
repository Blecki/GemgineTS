import { componentType } from "./Component.js";
import { Rect } from "./Rect.js";
import { Component } from "./Component.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { Engine } from "./Engine.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { Array2D } from "./Array2D.js";
import { Point } from "./Point.js";
import { TiledTilemap, TiledLayer, TiledInlineTileset } from "./TiledTilemap.js";
import { type DebuggableObject, PropertyGrid } from "./Debugger.js";
import { type FluentElement, Fluent } from "./Fluent.js";

@componentType("TilemapCollider")
export class TilemapColliderComponent extends Component {
  private tilemapComponent: TilemapComponent | undefined = undefined;
  private cachedGrid: Array2D<boolean> | undefined = undefined;
  private cachedOffset: Point | undefined = undefined;
  private cachedTileSize: Point | undefined = undefined;

  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference) {
    console.log("Trace: TilemapColliderComponent.initialize");
    super.initialize(engine, template, prototypeAsset);
    this.tilemapComponent = this.parent?.getComponent(TilemapComponent);
  }

  public createDebugger(name: string): FluentElement {
    let grid = new PropertyGrid(this, name, ["cachedOffset", "cachedTileSize"]);
    return grid.getElement();
  }
  
  public awake(engine: Engine) {
    console.log("Trace: TilemapColliderComponent.awake");
    if (this.tilemapComponent != undefined) {
      this.cachedGrid = this.tilemapComponent.fillArray(function(tileset: TiledInlineTileset | null, tile: number | null): boolean { if (tileset == undefined || tile == undefined) return false; else return true; });
      this.cachedOffset = this.tilemapComponent.worldspaceOriginOffset;
      this.cachedTileSize = this.tilemapComponent.tileSize;
    } else {
      console.warn("TilemapCollider could not find Tilemap.");
    }
  }

  overlaps(rect: Rect): boolean {
    // Calculate worldspace tilemap bounds.
    let worldSpaceTilemapBounds = new Rect((this.parent?.globalPosition.x ?? 0) + (this.cachedOffset?.x ?? 0), 
                                           (this.parent?.globalPosition.y ?? 0) + (this.cachedOffset?.y ?? 0),
                                           (this.cachedGrid?.width ?? 0) * (this.cachedTileSize?.x ?? 1),
                                           (this.cachedGrid?.height ?? 0) * (this.cachedTileSize?.y ?? 1));
                                           
    if (worldSpaceTilemapBounds.overlaps(rect) == false) return false;

    // Convert rect to tile space.
    let tileSpaceOtherBounds = new Rect((rect.x - worldSpaceTilemapBounds.x),
                                        (rect.y - worldSpaceTilemapBounds.y),
                                        rect.width,
                                        rect.height);

    console.log(this.cachedTileSize);
    console.log(worldSpaceTilemapBounds);
    console.log(tileSpaceOtherBounds);

    for (let x = Math.max(0, tileSpaceOtherBounds.x); x < Math.min(worldSpaceTilemapBounds.width, tileSpaceOtherBounds.x + tileSpaceOtherBounds.width); ++x) {
      for (let y = Math.max(0, tileSpaceOtherBounds.y); y < Math.min(worldSpaceTilemapBounds.height, tileSpaceOtherBounds.y + tileSpaceOtherBounds.height); ++y) {
        if (this.cachedGrid?.getValue(Math.floor(x / (this.cachedTileSize?.x ?? 1)), Math.floor(y / (this.cachedTileSize?.y ?? 1))) == true) return true;
      }
    }

    return false;
  }
}
