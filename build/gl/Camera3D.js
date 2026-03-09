import { Vector3Raw, v3Add } from "./Vector3.js";
import { m4LookAt } from "./Matrix4x4.js";
export class Camera3D {
    position = new Vector3Raw(0, 0, 0);
    forward = new Vector3Raw(0, 0, 1);
    up = new Vector3Raw(0, 1, 0);
    near = 0.01;
    far = 100.0;
    fov = (90 * Math.PI / 180);
    getViewMatrix() {
        return m4LookAt(this.position, v3Add(this.position, this.forward), this.up);
    }
    getProjectionMatrix(width, height) {
        const aspect = width / height;
        const f = Math.tan(Math.PI * 0.5 - 0.5 * (Math.PI / 2));
        const near = 0.001;
        const far = 100;
        const rangeInv = 1.0 / (near - far);
        const pMat = new Float32Array([
            f / aspect, 0, 0, 0,
            0, f, 0, 0,
            0, 0, (near + far) * rangeInv, -1,
            0, 0, (near + far) * rangeInv, 0
        ]);
        return pMat;
    }
}
//# sourceMappingURL=Camera3D.js.map