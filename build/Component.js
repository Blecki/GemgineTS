export class Component {
    parent;
    initialize(engine, template) { }
}
export class ComponentFactory {
    typeMap;
    constructor() {
        this.typeMap = new Map;
        this.addComponentType("Component", () => new Component());
    }
    addComponentType(name, createFunctor) {
        this.typeMap.set(name, createFunctor);
    }
    create(name) {
        if (this.typeMap.get(name) != undefined)
            return this.typeMap.get(name)();
        return new Component();
    }
    createFromPrototype(prototype) {
        let component = this.create(prototype.type);
        for (let property in prototype)
            component[property] = prototype[property];
        return component;
    }
}
//# sourceMappingURL=Component.js.map