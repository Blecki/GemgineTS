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
}