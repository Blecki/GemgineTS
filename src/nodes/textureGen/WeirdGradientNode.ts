import { ImageNode } from "./ImageNode.js";
import { LinearGradient } from "../../LinearGradient.js";
import { Gradient, type GradientPoint } from "../../Gradient.js";
import { Color } from "../../Color.js";
import { Point } from "../../Point.js";

export class WeirdGradientNode extends ImageNode {
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

    ImageNode.fullShade(output, (uv) => { 
      let gradientSpace = Math.abs(uv.x - 0.5) + Math.abs(uv.y - 0.5);
      return Color.asVector3(diagonalGradient.getColorAt(gradientSpace * 2));
    });
  
    this.setOutputImage(output);
  }  
}