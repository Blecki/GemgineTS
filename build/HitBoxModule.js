import { Module } from "./Module.js";
import { Entity } from "./Entity.js";
import { Rect } from "./Rect.js";
import { RenderLayers } from "./RenderLayers.js";
import { Engine } from "./Engine.js";
export class HitBoxRecord {
    worldspaceRect;
    type;
    owner;
    constructor(worldspaceRect, type, owner) {
        this.worldspaceRect = worldspaceRect;
        this.type = type;
        this.owner = owner;
    }
}
export class HitBoxModule extends Module {
    frameBoxes = [];
    constructor() {
        super();
    }
    update() {
    }
    clearBoxes() {
        this.frameBoxes = [];
    }
    recordBox(worldspaceRect, type, owner) {
        this.frameBoxes.push(new HitBoxRecord(worldspaceRect, type, owner));
    }
    render(engine, renderContext) {
        let target = renderContext.getTarget(RenderLayers.ObjectsDiffuse);
        for (let rect of this.frameBoxes)
            target.drawWireRectangle(rect.worldspaceRect, "red");
    }
    detectOverlaps(overlapHandler) {
        for (let a = 0; a < this.frameBoxes.length; ++a)
            for (let b = a + 1; b < this.frameBoxes.length; ++b) {
                if (this.frameBoxes[a].owner === this.frameBoxes[b].owner)
                    continue;
                if (this.frameBoxes[a].worldspaceRect.overlaps(this.frameBoxes[b].worldspaceRect))
                    overlapHandler(this.frameBoxes[a], this.frameBoxes[b]);
            }
    }
}
//# sourceMappingURL=HitBoxModule.js.map