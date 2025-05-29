import { Entity } from "./Entity.js";
import { AssetReference } from "./AssetReference.js";
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
    getAsset(path) {
        return this.assetMap?.get(path) ?? new AssetReference(path, null);
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
    createEntityFromPrototype(parent, prototypeAsset, template) {
        let resultID = allocateEntityID();
        let entity = new Entity(resultID);
        parent.addChild(entity);
        let prototype = prototypeAsset.asset;
        initializeFromJSON(prototype, entity);
        entity.components = prototype.components.map(componentPrototype => ComponentFactory.createFromPrototype(componentPrototype, entity));
        entity.components.forEach(c => c.parent = entity);
        entity.components.forEach(c => c.initialize(this, template, prototypeAsset));
        this.modules.forEach(module => module.entityCreated(entity));
        return entity;
    }
    createEntitytFromTiledTemplate(parent, template) {
        if (template.object?.properties == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return null;
        }
        let prototypeProperty = template.object.properties.find(p => p.name == 'prototype');
        if (prototypeProperty?.value == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return null;
        }
        let prototype = this.getAsset(prototypeProperty.value);
        if (prototype == undefined) {
            console.error(`Could not find prototype ${prototypeProperty.value}.`);
            return null;
        }
        let r = this.createEntityFromPrototype(parent, prototype, template);
        if (template.object.name != undefined && template.object.name !== null && template.object.name != "")
            r.name = template.object.name;
        return r;
    }
    createEntityFromTiledObject(parent, object) {
        if (object.templateAsset == undefined)
            return null;
        let r = this.createEntitytFromTiledTemplate(parent, object.templateAsset.asset);
        if (r != null) {
            r.localPosition = new Point(object.x ?? 0, object.y ?? 0); // Pass the TiledObject down?
            if (object.name !== undefined && object.name != "")
                r.name = object.name;
        }
        return r;
    }
}
//# sourceMappingURL=Engine.js.map