import { Transform } from "./Transform.js";

export class Component {
  public transform: Transform;
  public Clone() { return new Component(); }
}