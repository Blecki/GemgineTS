import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { Entity } from "./Entity.js";

export class AnimationComponent extends Component {
  animate() {}
}

export class AnimationModule extends Module {
  private animatables: AnimationComponent[] = [];

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (component instanceof AnimationComponent) {
        var rc = component as AnimationComponent;
        this.animatables.push(rc);
      }
    });
  }

  update() {
    this.animatables.forEach(a => a.animate());
  }
}