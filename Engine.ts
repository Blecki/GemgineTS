import { EntityPrototype } from "./EntityPrototype.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Transform } from "./Transform.js";
import { AssetReference } from "./AssetReference.js";
import { AllocateEntityID } from "./AllocateEntityID.js";
import { Component, ComponentFactory } from "./Component.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { TiledObject, TiledProperty } from "./TiledObject.js";
import { Point } from "./Point.js";

export class Engine {
  private modules: Module[] = [];
  public AssetMap: Map<string, AssetReference>;
  public SceneRoot: Transform;
  public componentFactory: ComponentFactory;

  constructor(AssetMap: Map<string, AssetReference>) {
    this.AssetMap = AssetMap;
    for (const [key, value] of AssetMap) {
      value.ResolveDependencies(this);
    }      
    this.SceneRoot = new Transform(0, null);
    this.componentFactory = new ComponentFactory();
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

  public CreateEntityFromPrototype(prototype: EntityPrototype, template: TiledTemplate): number {
    let resultID = AllocateEntityID();
    let transform = new Transform(resultID, this.SceneRoot);
    transform.position = new Point(template.object.x, template.object.y);

    let resultComponents = prototype.components.map(componentPrototype => {
      let newComponent = this.componentFactory.createFromPrototype(componentPrototype);
      newComponent.transform = transform;
      newComponent.ID = resultID;
      newComponent.Initialize(this, template);
      return newComponent;
    });

    this.modules.forEach(module => {
      resultComponents.forEach(component => {
        module.ComponentCreated(component) 
      });
    });

    return resultID;
  }

  public CreateEneitytFromTiledTemplate(template: TiledTemplate): number {
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