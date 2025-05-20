import { Module } from "./Module.js";
export class AnimationModule extends Module {
    animatables = [];
    isAnimatable(object) {
        return 'animate' in object;
    }
    entityCreated(entity) {
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
//# sourceMappingURL=AnimationModule.js.map