export class Vector3 {
    x;
    y;
    z;
    constructor(x, y, z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}
// Helper functions for vector operations
export function v3dotProduct(v1, v2) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}
export function v3normalize(v) {
    const length = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    return { x: v.x / length, y: v.y / length, z: v.z / length };
}
export function v3sub(a, b) {
    return new Vector3(a.x - b.x, a.y - b.y, a.z - b.z);
}
export function v3magnitudeSquared(a) {
    return (a.x * a.x) + (a.y * a.y) + (a.z * a.z);
}
//# sourceMappingURL=Vector3.js.map