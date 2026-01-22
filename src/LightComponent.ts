import { Color } from "./Color.js";
import { Point } from "./Point.js";
import { Component, componentType} from "./Component.js";

type LightComponentPrototype = {
  offset: object;
  radius: number;
  color: object;
  intensity: number;
}

@componentType("Light")
export class LightComponent extends Component {
  public offset: Point;
  public radius: number;
  public color: Color;
  public intensity: number;

  constructor(prototype?: object) {
    super(prototype);
    let p = prototype as LightComponentPrototype;
    this.offset = new Point(p?.offset);
    this.radius = p?.radius ?? 1;
    this.color = new Color(p?.color);
    this.intensity = p?.intensity ?? 1;
  }
}