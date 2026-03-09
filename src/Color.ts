import { Vector3Raw, type Vector3 } from "./gl/Vector3.js";

type ColorPrototype = {
    r: number;
    g: number;
    b: number;
    a: number;
}

export class Color {
  public r: number;
  public g: number;
  public b: number;
  public a: number;

  constructor(r: number | object, g?:number, b?: number, a?: number) {
    if (typeof(r) === 'object') {
      let p = r as ColorPrototype;
      this.r = p?.r ?? 255;
      this.g = p?.g ?? 255;
      this.b = p?.b ?? 255;
      this.a = p?.a ?? 255;
    }
    else {
      this.r = r ?? 255;
      this.g = g ?? 255;
      this.b = b ?? 255;
      this.a = a ?? 255;
    }
  }

  static lerp(start: Color, end: Color, t: number): Color {
    return new Color(
      start.r + (end.r - start.r) * t,
      start.g + (end.g - start.g) * t,
      start.b + (end.b - start.b) * t,
      start.a + (end.a - start.a) * t
    );
  }

  static asVector3(me: Color) : Vector3 {
    return new Vector3Raw(me.r, me.g, me.b);
  }

  public static get White() { return new Color(255, 255, 255, 1); }
  public static get Black() { return new Color(0, 0, 0, 1); }
}