import { Component } from "./Component.js";
import { Module } from "./Module.js";
export class AnimationComponent extends Component {
    animate() {
        throw new Error("Not Implemented");
    }
}
export class AnimationModule extends Module {
    animatables = [];
    entityCreated(entity) {
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
//# sourceMappingURL=AnimationModule.js.map