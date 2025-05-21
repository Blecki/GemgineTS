import { Component } from "./Component.js";
export class ComponentFactory {
    static typeMap;
    constructor() { }
    static addComponentType(name, createFunctor) {
        ComponentFactory.typeMap ??= new Map;
        ComponentFactory.typeMap.set(name, createFunctor);
        console.log(name);
    }
    static create(name) {
        const Constructor = ComponentFactory.typeMap.get(name);
        if (Constructor)
            return new Constructor();
        return new Component();
    }
    static createFromPrototype(prototype) {
        let component = ComponentFactory.create(prototype.type);
        for (let property in prototype)
            component[property] = prototype[property];
        return component;
    }
}
//# sourceMappingURL=ComponentFactory.js.map