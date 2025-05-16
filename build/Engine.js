import { Transform } from "./Transform.js";
import { AllocateEntityID } from "./AllocateEntityID.js";
import { ComponentFactory } from "./Component.js";
import { Point } from "./Point.js";
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
        console.log("Create Entity From Prototype");
        console.log(prototype);
        let resultComponents = prototype.components.map(componentPrototype => {
            let newComponent = this.componentFactory.createFromPrototype(componentPrototype);
            console.log(newComponent);
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
        return transform;
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
        console.log(object);
        var r = this.CreateEntitytFromTiledTemplate(object.templateAsset.asset);
        console.log(r);
        r.position = new Point(object.x, object.y); // Pass the TiledObject down?
        return r;
    }
}
//# sourceMappingURL=Engine.js.map