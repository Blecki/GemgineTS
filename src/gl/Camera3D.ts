import { type Vector3, Vector3Raw, v3Add } from "./Vector3.js";
import { type Matrix4x4, m4LookAt } from "./Matrix4x4.js";

export class Camera3D {
  public position: Vector3 = new Vector3Raw(0,0,0);
  public forward: Vector3 = new Vector3Raw(0,0,1);
  public up: Vector3 = new Vector3Raw(0,1,0);
  public near: number = 0.01;
  public far: number = 100.0;
  public fov: number = (90 * Math.PI / 180);

  public getViewMatrix() : Matrix4x4 {
    return m4LookAt(this.position, v3Add(this.position, this.forward), this.up);
  }

  public getProjectionMatrix(width: number, height: number) : Matrix4x4 {
    const aspect = width / height;
    const f = Math.tan(Math.PI * 0.5 - 0.5 * (Math.PI / 2));
    const near = 0.001;
    const far = 100;
    const rangeInv = 1.0 / (near - far);
    const pMat = new Float32Array([
      f/aspect,0,0,0, 
      0,f,0,0, 
      0,0,(near + far) * rangeInv, -1, 
      0,0,(near + far) * rangeInv, 0]);
    return pMat;
  }
}