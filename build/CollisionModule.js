import { Component, componentType } from "./Component.js";
import { Module } from "./Module.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Engine } from "./Engine.js";
import { GameTime } from "./GameTime.js";
import { RenderLayers } from "./RenderLayers.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
export class CollisionModule extends Module {
    collidables = [];
    isCollidable(object) {
        return 'overlaps' in object && 'parent' in object;
    }
    constructor() {
        super();
    }
    entityCreated(entity) {
        entity.components.forEach(component => {
            if (this.isCollidable(component)) {
                this.collidables.push(component);
            }
        });
    }
    update() {
        // Update acceleration structure.
    }
    overlaps(bounds) {
        let r = [];
        this.collidables.forEach((c) => {
            if (c.overlaps(bounds) && c.parent != null)
                r.push(c.parent);
        });
        return r;
    }
}
//# sourceMappingURL=CollisionModule.js.map