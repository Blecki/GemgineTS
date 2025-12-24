import { Component } from "./Component.js";
export class ComponentFactory {
    static typeMap;
    constructor() { }
    static addComponentType(name, createFunctor) {
        ComponentFactory.typeMap ??= new Map;
        ComponentFactory.typeMap.set(name, createFunctor);
    }
    static create(name, prototype) {
        const Constructor = ComponentFactory.typeMap.get(name);
        if (Constructor)
            return new Constructor(prototype);
        console.log("Unknown component type: " + name);
        return new Component(prototype);
    }
    static createFromBlueprint(prototype) {
        return ComponentFactory.create(prototype.type, prototype);
    }
}
//# sourceMappingURL=ComponentFactory.js.map