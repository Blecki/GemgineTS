import { Component } from "./Component.js";
import { Module } from "./Module.js";
export class AnimationComponent extends Component {
    animate() { }
}
export class AnimationModule extends Module {
    animatables = [];
    entityCreated(entity) {
        entity.components.forEach(component => {
            if (component instanceof AnimationComponent) {
                var rc = component;
                this.animatables.push(rc);
            }
        });
    }
    update() {
        this.animatables.forEach(a => a.animate());
    }
}
//# sourceMappingURL=AnimationModule.js.map