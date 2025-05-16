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

  public CreateEntityFromPrototype(prototype: EntityPrototype, template: TiledTemplate): Transform {
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
        module.ComponentCreated(component) 
      });
    });

    return transform;
  }

  public CreateEntitytFromTiledTemplate(template: TiledTemplate): Transform {
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

  public CreateEntityFromTiledObject(object: TiledObject): Transform {
    console.log(object);
    var r = this.CreateEntitytFromTiledTemplate(object.templateAsset.asset);
    console.log(r);
    r.position = new Point(object.x, object.y); // Pass the TiledObject down?
    return r;
  }
}