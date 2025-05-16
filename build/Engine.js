import { Entity } from "./Entity.js";
import { AllocateEntityID } from "./AllocateEntityID.js";
import { ComponentFactory } from "./Component.js";
import { Point } from "./Point.js";
import { GameTime } from "./GameTime.js";
export class Engine {
    modules = [];
    AssetMap;
    SceneRoot;
    componentFactory;
    constructor(AssetMap) {
        this.AssetMap = AssetMap;
        for (const [key, value] of AssetMap) {
            value.ResolveDependencies(this);
        }
        this.SceneRoot = new Entity(0, null);
        this.componentFactory = new ComponentFactory();
    }
    Update() {
        for (var module of this.modules)
            module.Update();
    }
    Render(context) {
        for (var module of this.modules)
            module.Render(context);
    }
    Run(context, frameCallback) {
        GameTime.update();
        this.Update();
        frameCallback();
        context.ClearScreen();
        this.Render(context);
        requestAnimationFrame(() => this.Run(context, frameCallback));
    }
    AddModule(newModule) {
        this.modules.push(newModule);
    }
    CreateEntityFromPrototype(prototype, template) {
        let resultID = AllocateEntityID();
        let entity = new Entity(resultID, this.SceneRoot);
        entity.components = prototype.components.map(componentPrototype => this.componentFactory.createFromPrototype(componentPrototype));
        entity.components.forEach(c => c.parent = entity);
        entity.components.forEach(c => c.Initialize(this, template));
        this.modules.forEach(module => module.EntityCreated(entity));
        return entity;
    }
    CreateEntitytFromTiledTemplate(template) {
        if (template.object.properties == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return null;
        }
        var prototypeProperty = template.object.properties.find(p => p.name == 'prototype');
        if (prototypeProperty == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return null;
        }
        var prototype = this.AssetMap.get(prototypeProperty.value);
        if (prototype == undefined) {
            console.error(`Could not find prototype ${prototypeProperty.value}.`);
            return null;
        }
        return this.CreateEntityFromPrototype(prototype.asset, template);
    }
    CreateEntityFromTiledObject(object) {
        var r = this.CreateEntitytFromTiledTemplate(object.templateAsset.asset);
        r.position = new Point(object.x, object.y); // Pass the TiledObject down?
        return r;
    }
}
//# sourceMappingURL=Engine.js.map