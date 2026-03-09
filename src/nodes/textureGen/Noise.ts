import { type Vector3, Vector3Raw } from "../../gl/Vector3.js";
import { ImageNode } from "./ImageNode.js";
import { TilingPerlin } from "../../PerlinNoise.js";
import { type Vector2, Vector2Raw } from "../../gl/Vector2.js";

export class Noise extends ImageNode {
  public width: number = 512;
  public height: number = 512;

  constructor() {
    super("noise");
    this.updateHeight();
  }

  public Process() : void {
    let output = new ImageData(this.width, this.height);
    let noise = new TilingPerlin();
    ImageNode.fullShade(output, (uv) => { return Noise.noiseAt(uv, noise); });
    this.setOutputImage(output);
  }
  
  static noiseAt(at: Vector2, perlin: TilingPerlin) : Vector3 {
    let noise = perlin.get(at.x, at.y, 16, 16);
    return new Vector3Raw((noise + 1) * 128, (noise + 1) * 128, (noise + 1) * 128);
  }
}