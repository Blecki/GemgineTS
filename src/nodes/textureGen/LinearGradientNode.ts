import { ImageNode } from "./ImageNode.js";
import { LinearGradient } from "../../LinearGradient.js";
import { Gradient, type GradientPoint } from "../../Gradient.js";
import { Color } from "../../Color.js";
import { Point } from "../../Point.js";

export class LinearGradientNode extends ImageNode {
  public width: number = 512;
  public height: number = 512;

  constructor() {
    super("noise");
    this.updateHeight();
  }

  public Process() : void {
    let output = new ImageData(this.width, this.height);
    
    // Temporary constant gradient, need value editors.
    const white = new Color(255, 255, 255, 255);
    const black = new Color(0, 0, 0, 255);

    const diagonalGradient = new Gradient([
      { duration: 0.0, color: white },
      { duration: 1.0, color: black }
    ]);

    const myGradientLine = new LinearGradient(
      new Point(0, 0), 
      new Point(1, 1), 
      diagonalGradient
    );

    ImageNode.fullShade(output, (uv) => { return Color.asVector3(myGradientLine.getColorAtUV(new Point(uv.x, uv.y))); });
  
    this.setOutputImage(output);
  }  
}