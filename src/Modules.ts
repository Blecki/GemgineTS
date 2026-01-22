import { Module } from "./Module.js";
import { Entity } from "./Entity.js";
import { Engine } from "./Engine.js";

export class Modules {
  private readonly modules: Module[] = [];
  
  public start(engine: Engine) {
    for (let module of this.modules)
      module.engineStart(engine);
  }

  public update() {
    for (let module of this.modules) 
      module.update();
  }

  public addModule(newModule: Module) {
    this.modules.push(newModule);
  }  

  public registerEntity(entity: Entity) {
    this.modules.forEach(module => module.entityCreated(entity));
  }

  public getModule<T>(t: new () => T): T | undefined {
    return this.modules.find((module) => module instanceof t) as T;
  }

}