
export class Vector3 {
  public x:number;
  public y:number;
  public z:number;

  constructor (x: number, y: number, z: number) {
    this.x = x;
    this.y = y;
    this.z = z;
  }
}

// Helper functions for vector operations
export function v3dotProduct(v1 : Vector3, v2: Vector3) : number {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

export function v3normalize(v: Vector3) : Vector3 {
    const length = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    return { x: v.x / length, y: v.y / length, z: v.z / length };
}

export function v3sub(a: Vector3, b: Vector3): Vector3 {
  return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}

export function v3magnitudeSquared(a: Vector3): number {
  return (a.x * a.x) + (a.y * a.y) + (a.z * a.z);
}