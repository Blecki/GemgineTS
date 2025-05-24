import { Component } from "./Component.js";
import { initializeFromJSON } from "./JsonConverter.js";
export class ComponentFactory {
    static typeMap;
    constructor() { }
    static addComponentType(name, createFunctor) {
        ComponentFactory.typeMap ??= new Map;
        ComponentFactory.typeMap.set(name, createFunctor);
        console.log(name);
    }
    static create(name, parent) {
        const Constructor = ComponentFactory.typeMap.get(name);
        if (Constructor)
            return new Constructor(parent);
        return new Component(parent);
    }
    static createFromPrototype(prototype, parent) {
        let component = ComponentFactory.create(prototype.type, parent);
        initializeFromJSON(prototype, component);
        return component;
    }
}
//# sourceMappingURL=ComponentFactory.js.map