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
import { ControllerComponent } from "./ControllerComponent.js";
import { CollisionModule } from "./CollisionModule.js";

export class PhysicsModule extends Module {
  private readonly bodies: ControllerComponent[] = [];
  private readonly gravity: Point = new Point(0, 512);
  private collision: CollisionModule | undefined;
  
  private isPhysics(object: any): object is ControllerComponent {
    return 'isGrounded' in object 
        && 'velocity' in object
        && 'useGravity' in object;
  }

  constructor() {
    super();
  }

  public engineStart(engine: Engine): void {
    this.collision = engine.modules.getModule(CollisionModule);
  }

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (this.isPhysics(component)) {
        this.bodies.push(component);
      }
    });
  }

  update():void {
    for (let body of this.bodies) {
      if (body.useGravity) {
        body.velocity = body.velocity.add(this.gravity.multiply(GameTime.getDeltaTime()));
        body.move(body.velocity.multiply(GameTime.getDeltaTime()));

        if (this.collision != undefined && body.parent != undefined)
        {
          let groundDetectionBounds = body.parent.globalBounds.withOffset(new Point(0, 1));
          let overlaps = this.collision.overlaps(groundDetectionBounds).filter(e => e != body.parent);
          body.isGrounded = overlaps.length > 0;
          if (body.isGrounded) body.velocity.y = 0;
        }
      }
    }
  }
}