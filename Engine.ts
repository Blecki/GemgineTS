import { EntityPrototype } from "./EntityPrototype.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Transform } from "./Transform.js";
import { AssetReference } from "./AssetReference.js";
import { AllocateEntityID } from "./AllocateEntityID.js";
import { Component } from "./Component.js";

export class Engine {
  private modules: Module[] = [];
  public AssetMap: Map<string, AssetReference>;
  public SceneRoot: Transform;

  constructor(AssetMap: Map<string, AssetReference>) {
    this.AssetMap = AssetMap;
    for (const [key, value] of AssetMap) {
      value.ResolveDependencies(this);
    }      
    this.SceneRoot = new Transform(0, null);
  }

  public Update() {
    for (var module of this.modules) 
      module.Update();
  }

  public Render(context: RenderingContext) {
    for (var module of this.modules)
      module.Render(context);
  }

  public Run(context: RenderingContext, frameCallback: () => void) {
    this.Update();
    frameCallback();
    context.ClearScreen();
    this.Render(context);
    requestAnimationFrame(() => this.Run(context, frameCallback));
  }

  public AddModule(newModule: Module) {
    this.modules.push(newModule);
  }  

  public CreateEntity(prototype: EntityPrototype): number {
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
        module.ComponentCreated(component) 
      });
    });

    return resultID;
  }
}