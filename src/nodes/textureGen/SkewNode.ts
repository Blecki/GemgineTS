import { ImageNode } from "../ImageNode.js";
import type { InputTerminal } from "../InputTerminal.js";
import { AssetStore } from "../../AssetStore.js";
import { Color } from "../../Color.js";
import { Rect } from "../../Rect.js";
import type { enqueueNodeForUpdateCallback } from "../Node.js";

export class SkewNode extends ImageNode {
  public image: InputTerminal;
  public skewX: InputTerminal;  
  public skewY: InputTerminal;

  constructor(assetStore: AssetStore) {
    super("Skew", "Skew", assetStore);
    this.image = this.AddInput("image", "image");
    this.skewX = this.AddInput("skewX", "number"); // Amount to shift X based on Y
    this.skewY = this.AddInput("skewY", "number"); // Amount to shift Y based on X
    this.updateHeight();
  }

  public Process(callback: enqueueNodeForUpdateCallback) : void {
    if (this.checkInputs(callback)) {
      const source = this.image.getValue() as ImageData;
      const sX = (this.skewX.getValue() as number) / source.width;
      const sY = (this.skewY.getValue() as number) / source.height;

      const width = source.width;
      const height = source.height;
      const output = new ImageData(width, height);

      const srcData = source.data;
      const dstData = output.data;

      for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
          // Use modulo to wrap coordinates around the edges
          // We add 'width' before the modulo to handle negative skews
          const srcX = ((Math.floor(x - sX * y) % width) + width) % width;
          const srcY = ((Math.floor(y - sY * x) % height) + height) % height;

          const dstIdx = (y * width + x) * 4;
          const srcIdx = (srcY * width + srcX) * 4;

          dstData[dstIdx] = srcData[srcIdx];
          dstData[dstIdx + 1] = srcData[srcIdx + 1];
          dstData[dstIdx + 2] = srcData[srcIdx + 2];
          dstData[dstIdx + 3] = srcData[srcIdx + 3];
        }
      }

      this.setOutputImage(output);
    }
  }
}