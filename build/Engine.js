import { Entity } from "./Entity.js";
import { allocateEntityID } from "./AllocateEntityID.js";
import { ComponentFactory } from "./ComponentFactory.js";
import { Point } from "./Point.js";
import { GameTime } from "./GameTime.js";
import { initializeFromJSON } from "./JsonConverter.js";
export class Engine {
    modules = [];
    assetMap;
    sceneRoot;
    debugMode = false;
    fpsQueue;
    constructor(assetMap) {
        this.assetMap = assetMap;
        for (const [, value] of assetMap) {
            value.resolveDependencies(this);
        }
        this.sceneRoot = new Entity(0);
        this.fpsQueue = [];
    }
    update() {
        let start = performance.now();
        for (let module of this.modules)
            module.update();
        let end = performance.now();
        this.fpsQueue.push(end - start);
        if (this.fpsQueue.length > 200)
            this.fpsQueue.shift();
    }
    render(context) {
        for (let module of this.modules)
            module.render(this, context);
        let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
        context.context.fillStyle = 'black';
        context.context.textAlign = 'left';
        context.context.textBaseline = 'top';
        context.context.fillText(averageFrameTime.toString(), 5, 25);
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
    createEntityFromPrototype(parent, prototype, template) {
        let resultID = allocateEntityID();
        let entity = new Entity(resultID);
        parent.addChild(entity);
        initializeFromJSON(prototype, entity);
        entity.components = prototype.components.map(componentPrototype => ComponentFactory.createFromPrototype(componentPrototype));
        entity.components.forEach(c => c.parent = entity);
        entity.components.forEach(c => c.initialize(this, template));
        this.modules.forEach(module => module.entityCreated(entity));
        return entity;
    }
    createEntitytFromTiledTemplate(parent, template) {
        if (template.object.properties == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return null;
        }
        let prototypeProperty = template.object.properties.find(p => p.name == 'prototype');
        if (prototypeProperty == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return null;
        }
        let prototype = this.assetMap.get(prototypeProperty.value);
        if (prototype == undefined) {
            console.error(`Could not find prototype ${prototypeProperty.value}.`);
            return null;
        }
        let r = this.createEntityFromPrototype(parent, prototype.asset, template);
        if (template.object.name !== null && template.object.name != "")
            r.name = template.object.name;
        return r;
    }
    createEntityFromTiledObject(parent, object) {
        let r = this.createEntitytFromTiledTemplate(parent, object.templateAsset.asset);
        r.localPosition = new Point(object.x, object.y); // Pass the TiledObject down?
        if (object.name !== null && object.name != "")
            r.name = object.name;
        return r;
    }
}
//# sourceMappingURL=Engine.js.map