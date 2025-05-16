import { Entity } from "./Entity.js";
import { RenderingContext } from "./RenderingContext.js";

export class Module {
  public entityCreated(entity: Entity) {}
  public update() {}
  public render(context: RenderingContext) {}
}