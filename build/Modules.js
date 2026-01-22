import { Module } from "./Module.js";
import { Entity } from "./Entity.js";
import { Engine } from "./Engine.js";
export class Modules {
    modules = [];
    start(engine) {
        for (let module of this.modules)
            module.engineStart(engine);
    }
    update() {
        for (let module of this.modules)
            module.update();
    }
    addModule(newModule) {
        this.modules.push(newModule);
    }
    registerEntity(entity) {
        this.modules.forEach(module => module.entityCreated(entity));
    }
    getModule(t) {
        return this.modules.find((module) => module instanceof t);
    }
}
//# sourceMappingURL=Modules.js.map