export interface Vector2 {
  x: number;
  y: number;
};

export class Vector2Raw {
  public x: number = 0;
  public y: number = 0;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }
}

export class Vector2Buffer {
  private buffer: Float32Array;

  constructor(buffer: Float32Array) {
    this.buffer = buffer;
  }

  public get x(): number {
    return this.buffer[0];
  }

  public set x(value: number) {
    this.buffer[0] = value;
  }

  public get y(): number {
    return this.buffer[1];
  }

  public set y(value: number) {
    this.buffer[1] = value;
  }

  public writeFromRaw(raw: Vector2Raw) {
    this.x = raw.x;
    this.y = raw.y;
  }
}

export function v2Add(a: Vector2, b: Vector2) : Vector2Raw {
  return new Vector2Raw(a.x + b.x, a.y + b.y);
}

export function v2Sub(a: Vector2, b: Vector2) : Vector2Raw {
  return new Vector2Raw(a.x - b.x, a.y - b.y);
}
