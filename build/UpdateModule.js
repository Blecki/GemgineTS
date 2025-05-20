import { Module } from "./Module.js";
export class UpdateModule extends Module {
    updateables = [];
    isUpdateable(object) {
        return 'update' in object;
    }
    entityCreated(entity) {
        entity.components.forEach(component => {
            if (this.isUpdateable(component))
                this.updateables.push(component);
        });
    }
    update() {
        for (let updateable of this.updateables)
            updateable.update();
    }
}
//# sourceMappingURL=UpdateModule.js.map