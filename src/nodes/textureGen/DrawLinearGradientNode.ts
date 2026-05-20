import { ImageNode } from "../ImageNode.js";
import { LinearGradient } from "../../LinearGradient.js";
import { Color } from "../../Color.js";
import { Point } from "../../Point.js";
import { Gradient } from "../../Gradient.js";
import { fullShade } from "../FullShade.js";
import { AssetStore } from "../../AssetStore.js";
import type { InputTerminal } from "../InputTerminal.js";
import type { enqueueNodeForUpdateCallback } from "../Node.js";

export class DrawLinearGradientNode extends ImageNode {
  public gradient: InputTerminal;
  public dimensions: InputTerminal;
  public start: InputTerminal;
  public end: InputTerminal;

  constructor(assetStore: AssetStore) {
    super("DrawLinearGradient", "Linear Gradient", assetStore);
    this.gradient = this.AddInput("gradient", "gradient");
    this.dimensions = this.AddInput("dimensions", "point");
    this.start = this.AddInput("start", "point");
    this.end = this.AddInput("end", "point");
    this.updateHeight();
  }

  public Process(callback: enqueueNodeForUpdateCallback) : void {
    if (this.checkInputs(callback)) {
      let dims = this.dimensions.getValue() as Point;
      let output = new ImageData(dims.x, dims.y);

      const myGradientLine = new LinearGradient(
        this.start.getValue() as Point, 
        this.end.getValue() as Point, 
        this.gradient.getValue() as Gradient
      );

      fullShade(output, (uv) => { return Color.asVector3(myGradientLine.getColorAtUV(new Point(uv.x, uv.y))); });
    
      this.setOutputImage(output);
    }
  }
}