import { Entity } from "./Entity.js";
import { allocateEntityID } from "./AllocateEntityID.js";
import { ComponentFactory } from "./Component.js";
import { Point } from "./Point.js";
import { GameTime } from "./GameTime.js";
export class Engine {
    modules = [];
    assetMap;
    sceneRoot;
    componentFactory;
    constructor(assetMap) {
        this.assetMap = assetMap;
        for (const [key, value] of assetMap) {
            value.resolveDependencies(this);
        }
        this.sceneRoot = new Entity(0, null);
        this.componentFactory = new ComponentFactory();
    }
    update() {
        for (var module of this.modules)
            module.update();
    }
    render(context) {
        for (var module of this.modules)
            module.render(context);
    }
    run(context, frameCallback) {
        GameTime.update();
        this.update();
        frameCallback();
        context.clearScreen();
        this.render(context);
        requestAnimationFrame(() => this.run(context, frameCallback));
    }
    addModule(newModule) {
        this.modules.push(newModule);
    }
    createEntityFromPrototype(prototype, template) {
        let resultID = allocateEntityID();
        let entity = new Entity(resultID, this.sceneRoot);
        entity.components = prototype.components.map(componentPrototype => this.componentFactory.createFromPrototype(componentPrototype));
        entity.components.forEach(c => c.parent = entity);
        entity.components.forEach(c => c.initialize(this, template));
        this.modules.forEach(module => module.entityCreated(entity));
        return entity;
    }
    createEntitytFromTiledTemplate(template) {
        if (template.object.properties == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return null;
        }
        var prototypeProperty = template.object.properties.find(p => p.name == 'prototype');
        if (prototypeProperty == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return null;
        }
        var prototype = this.assetMap.get(prototypeProperty.value);
        if (prototype == undefined) {
            console.error(`Could not find prototype ${prototypeProperty.value}.`);
            return null;
        }
        return this.createEntityFromPrototype(prototype.asset, template);
    }
    createEntityFromTiledObject(object) {
        var r = this.createEntitytFromTiledTemplate(object.templateAsset.asset);
        r.position = new Point(object.x, object.y); // Pass the TiledObject down?
        return r;
    }
}
//# sourceMappingURL=Engine.js.map