import { Module } from "./Module.js";
import { Entity } from "./Entity.js";

interface AnimateableComponent {
  animate(): void;
}

export class AnimationModule extends Module {
  private readonly animatables: AnimateableComponent[] = [];

  
  private isAnimatable(object: any): object is AnimateableComponent {
    return 'animate' in object;
  }

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (this.isAnimatable(component)) {
        this.animatables.push(component);
      }
    });
  }

  update() {
    this.animatables.forEach(a => a.animate());
  }
}