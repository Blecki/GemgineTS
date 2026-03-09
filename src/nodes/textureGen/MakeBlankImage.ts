import { type Vector3, Vector3Raw } from "../../gl/Vector3.js";
import { ImageNode } from "./ImageNode.js";

export class MakeBlankImage extends ImageNode {
  public width: number = 512;
  public height: number = 512;
  public color: Vector3 = new Vector3Raw(255, 255, 255);

  constructor() {
    super("blank");
    this.updateHeight();
  }

  public Process() : void {
    let output = new ImageData(this.width, this.height);
    let pixels = output.data;
    for (let i = 0; i < pixels.length; i += 4) {
      pixels[i] = this.color.x;
      pixels[i+1] = this.color.y;
      pixels[i+2] = this.color.z;
      pixels[i+3] = 255;
    }
    this.setOutputImage(output);
  }
}