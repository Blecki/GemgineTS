import { Entity } from "./Entity.js";
import { RenderingContext } from "./RenderingContext.js";
import { Engine } from "./Engine.js";

export class Module {
  public entityCreated(entity: Entity):void {}
  public update():void {}
  public render(engine: Engine, context: RenderingContext):void {}
}