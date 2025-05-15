import { Transform } from "./Transform.js";
import { AllocateEntityID } from "./AllocateEntityID.js";
import { ComponentFactory } from "./Component.js";
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
        this.SceneRoot = new Transform(0, null);
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
        let transform = new Transform(resultID, this.SceneRoot);
        let resultComponents = prototype.components.map(componentPrototype => {
            let newComponent = this.componentFactory.createFromPrototype(componentPrototype);
            newComponent.transform = transform;
            newComponent.ID = resultID;
            newComponent.Initialize(this, template);
            return newComponent;
        });
        this.modules.forEach(module => {
            resultComponents.forEach(component => {
                module.ComponentCreated(component);
            });
        });
        return resultID;
    }
    CreateEneitytFromTiledTemplate(template) {
        if (template.object.properties == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return -1;
        }
        var prototypeProperty = template.object.properties.find(p => p.name == 'prototype');
        if (prototypeProperty == undefined) {
            console.error("Can't create entity from template without a prototype.");
            return -1;
        }
        var prototype = this.AssetMap.get(prototypeProperty.value);
        if (prototype == undefined) {
            console.error(`Could not find prototype ${prototypeProperty.value}.`);
            return -1;
        }
        return this.CreateEntityFromPrototype(prototype.asset, template);
    }
}
//# sourceMappingURL=Engine.js.map