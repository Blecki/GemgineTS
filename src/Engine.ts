import { EntityPrototype } from "./EntityPrototype.js";
import { Module } from "./Module.js";
import { RenderingContext } from "./RenderingContext.js";
import { Entity } from "./Entity.js";
import { AssetReference } from "./AssetReference.js";
import { allocateEntityID } from "./AllocateEntityID.js";
import { Component } from "./Component.js";
import { ComponentFactory } from "./ComponentFactory.js";
import { TiledTemplate } from "./Tiled/TiledTemplate.js";
import { TiledObject, TiledProperty } from "./Tiled/TiledObject.js";
import { Point } from "./Point.js";
import { GameTime } from "./GameTime.js";
import { initializeFromJSON } from "./JsonConverter.js";

export class Engine {
  private readonly modules: Module[] = [];
  public assetMap: Map<string, AssetReference>;
  public sceneRoot: Entity;
  public debugMode: boolean = false;
  public fpsQueue: number[];


  constructor(assetMap: Map<string, AssetReference>) {
    this.assetMap = assetMap;
    for (const [, value] of assetMap) {
      value.resolveDependencies(this);
    }      
    this.sceneRoot = new Entity(0);
    this.fpsQueue = [];
  }

  public update() {
    let start = performance.now();
    for (let module of this.modules) 
      module.update();
    let end = performance.now();
    this.fpsQueue.push(end - start);
    if (this.fpsQueue.length > 200) this.fpsQueue.shift();
  }

  public render(context: RenderingContext) {
    for (let module of this.modules)
      module.render(this, context);

    
    let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
    context.context.fillStyle = 'black';
    context.context.textAlign = 'left';
    context.context.textBaseline = 'top';
    context.context.fillText(averageFrameTime.toString(), 5, 25);
  }

  public run(context: RenderingContext, frameCallback: () => void) {
    GameTime.update();
    this.update();
    frameCallback();
    context.clearScreen();
    this.render(context);
    requestAnimationFrame(() => this.run(context, frameCallback));
  }

  public addModule(newModule: Module) {
    this.modules.push(newModule);
  }  

  public createEntityFromPrototype(parent: Entity, prototype: EntityPrototype, template: TiledTemplate): Entity {
    let resultID = allocateEntityID();
    let entity = new Entity(resultID);
    parent.addChild(entity);

    initializeFromJSON(prototype, entity);
    entity.components = prototype.components.map(componentPrototype => ComponentFactory.createFromPrototype(componentPrototype));
    entity.components.forEach(c => c.parent = entity);
    entity.components.forEach(c => c.initialize(this, template));
    this.modules.forEach(module => module.entityCreated(entity));

    return entity;
  }

  public createEntitytFromTiledTemplate(parent: Entity, template: TiledTemplate): Entity {
    if (template.object.properties == undefined) {
      console.error("Can't create entity from template without a prototype.");
      return null;
    }
    let prototypeProperty = template.object.properties.find(p => p.name == 'prototype');
    if (prototypeProperty == undefined) {
      console.error("Can't create entity from template without a prototype.");
      return null;
    }
    let prototype = this.assetMap.get(prototypeProperty.value);
    if (prototype == undefined) {
      console.error(`Could not find prototype ${prototypeProperty.value}.`);
      return null;
    }
    let r = this.createEntityFromPrototype(parent, prototype.asset, template); 
    if (template.object.name !== null && template.object.name != "")
      r.name = template.object.name;
    return r;  
  }

  public createEntityFromTiledObject(parent: Entity, object: TiledObject): Entity {
    let r = this.createEntitytFromTiledTemplate(parent, object.templateAsset.asset);
    r.localPosition = new Point(object.x, object.y); // Pass the TiledObject down?
    if (object.name !== null && object.name != "")
      r.name = object.name;
    return r;
  }
}