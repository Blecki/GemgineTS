import { Transform } from "./Transform.js";
import { AllocateEntityID } from "./AllocateEntityID.js";
export class Engine {
    modules = [];
    AssetMap;
    SceneRoot;
    constructor(AssetMap) {
        this.AssetMap = AssetMap;
        for (const [key, value] of AssetMap) {
            value.ResolveDependencies(this);
        }
        this.SceneRoot = new Transform(0, null);
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
    CreateEntity(prototype) {
        let resultID = AllocateEntityID();
        let transform = new Transform(resultID, this.SceneRoot);
        let resultComponents = prototype.components.map(component => {
            let newComponent = component.Clone();
            newComponent.transform = transform;
            newComponent.ID = resultID;
            return newComponent;
        });
        this.modules.forEach(module => {
            resultComponents.forEach(component => {
                module.ComponentCreated(component);
            });
        });
        return resultID;
    }
}
//# sourceMappingURL=Engine.js.map