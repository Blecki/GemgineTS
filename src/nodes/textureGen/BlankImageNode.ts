import { ImageNode } from "../ImageNode.js";
import { Point } from "../../Point.js";
import { Color } from "../../Color.js";
import { AssetStore } from "../../AssetStore.js";
import type { InputTerminal } from "../InputTerminal.js";
import type { enqueueNodeForUpdateCallback } from "../Node.js";

export class BlankImageNode extends ImageNode {
  public dimensions: InputTerminal;
  public color: InputTerminal;

  constructor(assetStore: AssetStore) {
    super("BlankImage", "Blank Image", assetStore);
    this.dimensions = this.AddInput("dimensions", "point");
    this.color = this.AddInput("color", "color");
    this.updateHeight();
  }

  public Process(callback: enqueueNodeForUpdateCallback) : void {
    if (this.checkInputs(callback)) {
      let _dim = this.dimensions.getValue() as Point;
      let _c = this.color.getValue() as Color;

      let output = new ImageData(_dim.x, _dim.y);
      let pixels = output.data;
      for (let i = 0; i < pixels.length; i += 4) {
        pixels[i] = _c.r;
        pixels[i+1] = _c.g;
        pixels[i+2] = _c.b;
        pixels[i+3] = _c.a;
      }
      this.setOutputImage(output);
    }
  }
}