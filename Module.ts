import { Component } from "./Component.js";
import { RenderingContext} from "./RenderingContext.js";

export class Module {
  public ComponentCreated(component: Component) {}
  public Update() {}
  public Render(context: RenderingContext) {}
}