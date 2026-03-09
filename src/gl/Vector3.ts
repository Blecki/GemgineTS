export interface Vector3 {
  x: number;
  y: number;
  z: number;
};

export class Vector3Raw {
  public x: number = 0;
  public y: number = 0;
  public z: number = 0;

  constructor(x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

export class Vector3Buffer {
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

  public get z(): number {
    return this.buffer[2];
  }

  public set z(value: number) {
    this.buffer[2] = value;
  }

  public writeFromRaw(raw: Vector3Raw) {
    this.x = raw.x;
    this.y = raw.y;
    this.z = raw.z;
  }
}

export function v3Add(a: Vector3, b: Vector3) : Vector3Raw {
  return new Vector3Raw(a.x + b.x, a.y + b.y, a.z + b.z);
}

export function v3Sub(a: Vector3, b: Vector3) : Vector3Raw {
  return new Vector3Raw(a.x - b.x, a.y - b.y, a.z - b.z);
}
