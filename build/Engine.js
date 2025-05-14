import { Entity } from "./Entity.js";
import { Transform } from "./Transform.js";
export class Engine {
    modules = [];
    AssetMap;
    constructor(AssetMap) {
        this.AssetMap = AssetMap;
        for (const [key, value] of AssetMap) {
            value.ResolveDependencies(this);
        }
    }
    Update() {
        for (var module of this.modules)
            module.Update();
    }
    Render(context) {
        for (var module of this.modules)
            module.Render(context);
    }
    Run(context) {
        this.Update();
        context.ClearScreen();
        this.Render(context);
        requestAnimationFrame(() => this.Run(context));
    }
    AddModule(newModule) {
        this.modules.push(newModule);
    }
    CreateEntity(prototype) {
        let result = new Entity();
        result.transform = new Transform();
        prototype.components.forEach(component => {
            let newComponent = component.Clone();
            newComponent.transform = result.transform;
            newComponent.engine = this;
            result.components.push(newComponent);
        });
        result.components.forEach(component => component.OnSpawn());
        this.modules.forEach(module => {
            result.components.forEach(component => {
                module.ComponentCreated(component);
            });
        });
        return result;
    }
}
//# sourceMappingURL=Engine.js.map