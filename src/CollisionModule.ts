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

interface ColliderComponent {
  overlaps(rect: Rect): boolean;
  parent: Entity;
}

export class CollisionModule extends Module {
  private readonly collidables: ColliderComponent[] = [];
  
  private isCollidable(object: any): object is ColliderComponent {
    return 'overlaps' in object && 'parent' in object;
  }

  constructor() {
    super();
  }

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (this.isCollidable(component)) {
        this.collidables.push(component);
      }
    });
  }

  update():void {
    // Update acceleration structure.
  }

  overlaps(bounds: Rect): Entity[] {
    let r: Entity[] = [];
    this.collidables.forEach((c) => {
      if (c.overlaps(bounds) && c.parent != null) r.push(c.parent);
    });
    return r;
  }
}