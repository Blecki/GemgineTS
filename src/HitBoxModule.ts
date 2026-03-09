import { Module } from "./Module.js";
import { Entity } from "./Entity.js";
import { Rect } from "./Rect.js";
import type { RenderContext } from "./RenderContext.js";
import { RenderLayers } from "./RenderLayers.js";
import { Engine } from "./Engine.js";

export class HitBoxRecord {
  public worldspaceRect: Rect;
  public type: string;
  public owner: Entity;

  constructor(worldspaceRect: Rect, type: string, owner: Entity) {
    this.worldspaceRect = worldspaceRect;
    this.type = type;
    this.owner = owner;
  }
}

type OverlapHandlerCallback = (a: HitBoxRecord, b: HitBoxRecord) => void;

export class HitBoxModule extends Module {
  public frameBoxes: HitBoxRecord[] = [];

  constructor() {
    super();
  }


  update() : void {

  }

  clearBoxes() : void {
    this.frameBoxes = [];
  }

  recordBox(worldspaceRect: Rect, type: string, owner: Entity) : void {
    this.frameBoxes.push(new HitBoxRecord(worldspaceRect, type, owner));
  }

  render(engine: Engine, renderContext: RenderContext) {
    let target = renderContext.getTarget(RenderLayers.ObjectsDiffuse);
    for (let rect of this.frameBoxes) 
      target.drawWireRectangle(rect.worldspaceRect, "red");
  }

  detectOverlaps(overlapHandler: OverlapHandlerCallback) {
    for (let a = 0; a < this.frameBoxes.length; ++a)
      for (let b = a + 1; b < this.frameBoxes.length; ++b) {
        if (this.frameBoxes[a].owner === this.frameBoxes[b].owner)
          continue;
        if (this.frameBoxes[a].worldspaceRect.overlaps(this.frameBoxes[b].worldspaceRect)) 
          overlapHandler(this.frameBoxes[a], this.frameBoxes[b]);
      }
  }
}