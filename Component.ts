import { Transform } from "./Transform.js";

export class Component {
  public ID: number;
  public transform: Transform;
  public Clone() { return new Component(); }
}