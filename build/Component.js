export class Component {
    ID;
    transform;
    Initialize(engine, template) { }
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
        var component = this.create(prototype.type);
        for (var property in prototype)
            component[property] = prototype[property];
        return component;
    }
}
//# sourceMappingURL=Component.js.map