import { Component } from "./Component.js";
import { Module } from "./Module.js";
export class AnimationComponent extends Component {
}
export class AnimationModule extends Module {
    animatables = [];
    EntityCreated(entity) {
        entity.components.forEach(component => {
            if (component instanceof AnimationComponent) {
                var rc = component;
                this.animatables.push(rc);
            }
        });
    }
    Update() {
    }
}
//# sourceMappingURL=AnimationModule.js.map