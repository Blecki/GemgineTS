import { type Color } from "./Color.js";
import { type Vector3 } from "./Vector3.js";

export class Light {
  public Position: Vector3;
  public Radius: number;
  public Color: Color;

  constructor(Position: Vector3, Radius: number, Color: Color) {
    this.Position = Position;
    this.Radius = Radius;
    this.Color = Color;
  }
}