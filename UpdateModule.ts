import { Module } from "./Module.js";
import { Entity } from "./Entity.js";

interface UpdateComponent {
  update(): void;
}

export class UpdateModule extends Module {
  private readonly updateables: UpdateComponent[] = [];
  
  private isUpdateable(object: any): object is UpdateComponent {
    return 'update' in object;
  }

  entityCreated(entity: Entity) {
    entity.components.forEach(component => {
      if (this.isUpdateable(component))
        this.updateables.push(component);
    });
  }

  public update():void {
    for (let updateable of this.updateables)
      updateable.update();
  }
}