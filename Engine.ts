import { EntityPrototype } from "./EntityPrototype.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Entity } from "./Entity.js";
import { Transform } from "./Transform.js";
import { AssetReference } from "./AssetManagement/AssetReference.js";

export class Engine {
  private modules: Module[] = [];
  public AssetMap: Map<string, AssetReference>;

  constructor(AssetMap: Map<string, AssetReference>) {
    this.AssetMap = AssetMap;
    for (const [key, value] of AssetMap) {
      value.ResolveDependencies(this);
    }      
  }

  public Update() {
    for (var module of this.modules) 
      module.Update();
  }

  public Render(context: RenderingContext) {
    for (var module of this.modules)
      module.Render(context);
  }

  public Run(context: RenderingContext) {
    this.Update();
    context.ClearScreen();
    this.Render(context);
    requestAnimationFrame(() => this.Run(context));
  }

  public AddModule(newModule: Module) {
    this.modules.push(newModule);
  }  

  public CreateEntity(prototype: EntityPrototype): Entity {
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
        module.ComponentCreated(component) 
      });
    });

    return result;
  }
}