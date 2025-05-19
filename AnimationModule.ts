import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { Entity } from "./Entity.js";

export class AnimationComponent extends Component {
  animate() {
    throw new Error("Not Implemented");
  }
}

export class AnimationModule extends Module {
  private readonly animatables: AnimationComponent[] = [];

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (component instanceof AnimationComponent) {
        this.animatables.push(component);
      }
    });
  }

  update() {
    this.animatables.forEach(a => a.animate());
  }
}