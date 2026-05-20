import { type Vector3, Vector3Raw } from "../../gl/Vector3.js";
import { ImageNode } from "../ImageNode.js";
import { TilingPerlin } from "../../PerlinNoise.js";
import { type Vector2, Vector2Raw } from "../../gl/Vector2.js";
import { fullShade } from "../FullShade.js";
import { AssetStore } from "../../AssetStore.js";
import { Point } from "../../Point.js";
import { InputTerminal } from "../InputTerminal.js";
import type { enqueueNodeForUpdateCallback } from "../Node.js";

export class NoiseNode extends ImageNode {
  public dimensions: InputTerminal;

  constructor(assetStore: AssetStore) {
    super("Noise", "noise", assetStore);
    this.dimensions = this.AddInput("dimensions", "point");
    this.updateHeight();
  }

  public Process(callback: enqueueNodeForUpdateCallback) : void {
    if (this.checkInputs(callback)) {
      let _dim = this.dimensions.getValue() as Point;
      let output = new ImageData(_dim.x, _dim.y);
      let noise = new TilingPerlin();
      fullShade(output, (uv) => { return NoiseNode.noiseAt(uv, noise); });
      this.setOutputImage(output);
    }
  }
  
  static noiseAt(at: Vector2, perlin: TilingPerlin) : Vector3 {
    let noise = perlin.get(at.x, at.y, 16, 16);
    return new Vector3Raw((noise + 1) * 128, (noise + 1) * 128, (noise + 1) * 128);
  }
}