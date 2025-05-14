import { Transform } from "./Transform.js";
import { Engine } from "./Engine.js";

export class Component {
  public engine: Engine;
  public transform: Transform;
  public Clone() { return new Component(); }
  public OnSpawn() {}
}