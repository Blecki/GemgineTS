import { ImageNode } from "../ImageNode.js";
import { Point } from "../../Point.js";
import type { InputTerminal } from "../InputTerminal.js";
import { AssetStore } from "../../AssetStore.js";
import type { enqueueNodeForUpdateCallback } from "../Node.js";

export class BlitNode extends ImageNode {
  public base: InputTerminal;
  public source: InputTerminal;  
  public offset: InputTerminal;
  public repeat: InputTerminal;

  constructor(assetStore: AssetStore) {
    super("Blit", "Blit", assetStore);
    this.offset = this.AddInput("offset", "point");
    this.repeat = this.AddInput("repeat", "point");
    this.base = this.AddInput("base", "image");
    this.source = this.AddInput("source", "image");
    this.updateHeight();
  }

  public Process(callback: enqueueNodeForUpdateCallback) : void {
    if (this.checkInputs(callback)) {
      let base = this.base.getValue() as ImageData;
      let source = this.source.getValue() as ImageData;
      let offset = this.offset.getValue() as Point;
      let repeat = this.repeat.getValue() as Point;
      
      let output = new ImageData(base.width, base.height);
      if (repeat.x > 0 && repeat.y > 0) {
        for (var x = offset.x; x < base.width; x += repeat.x)
          for (var y = offset.y; y < base.height; y += repeat.y)
            this.blit(source, output, x, y);
      }
      
      this.setOutputImage(output);
    }
  }

  public blit(source: ImageData, dest: ImageData, x: number, y: number) : void {
    let destPixels = dest.data;
    let sourcePixels = source.data;

    for (var dx = x, sx = 0; dx < dest.width && sx < source.width; dx += 1, sx += 1) {
      for (var dy = y, sy = 0; dy < dest.height && sy < source.height; dy += 1, sy += 1) {
        let di = ((dy * dest.width) + dx) * 4;
        let si = ((sy * source.width) + sx) * 4;
        destPixels[di] = sourcePixels[si];
        destPixels[di + 1] = sourcePixels[si + 1];
        destPixels[di + 2] = sourcePixels[si + 2];
        destPixels[di + 3] = sourcePixels[si + 3];
      }
    }
  }
}