import { EntityPrototype } from "./EntityPrototype.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Entity } from "./Entity.js";
import { AssetReference } from "./AssetReference.js";
import { AllocateEntityID } from "./AllocateEntityID.js";
import { Component, ComponentFactory } from "./Component.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { TiledObject, TiledProperty } from "./TiledObject.js";
import { Point } from "./Point.js";
import { GameTime } from "./GameTime.js";

export class Engine {
  private modules: Module[] = [];
  public AssetMap: Map<string, AssetReference>;
  public SceneRoot: Entity;
  public componentFactory: ComponentFactory;

  constructor(AssetMap: Map<string, AssetReference>) {
    this.AssetMap = AssetMap;
    for (const [key, value] of AssetMap) {
      value.ResolveDependencies(this);
    }      
    this.SceneRoot = new Entity(0, null);
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
    GameTime.update();
    this.Update();
    frameCallback();
    context.ClearScreen();
    this.Render(context);
    requestAnimationFrame(() => this.Run(context, frameCallback));
  }

  public AddModule(newModule: Module) {
    this.modules.push(newModule);
  }  

  public CreateEntityFromPrototype(prototype: EntityPrototype, template: TiledTemplate): Entity {
    let resultID = AllocateEntityID();
    let entity = new Entity(resultID, this.SceneRoot);

    entity.components = prototype.components.map(componentPrototype => this.componentFactory.createFromPrototype(componentPrototype));
    entity.components.forEach(c => c.parent = entity);
    entity.components.forEach(c => c.Initialize(this, template));

    this.modules.forEach(module => module.EntityCreated(entity));

    return entity;
  }

  public CreateEntitytFromTiledTemplate(template: TiledTemplate): Entity {
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

  public CreateEntityFromTiledObject(object: TiledObject): Entity {
    var r = this.CreateEntitytFromTiledTemplate(object.templateAsset.asset);
    r.position = new Point(object.x, object.y); // Pass the TiledObject down?
    return r;
  }
}