import { Entity } from "./Entity.js";
import { RenderingContext } from "./RenderingContext.js";

export class Module {
  public EntityCreated(entity: Entity) {}
  public Update() {}
  public Render(context: RenderingContext) {}
}