import { type Vector3, Vector3Raw } from "../../gl/Vector3.js";
import { ImageNode } from "./ImageNode.js";
import { Point } from "../../Point.js";
import { NodeSetting } from "../NodeSetting.js";
import { Color } from "../../Color.js";

export class BlankImage extends ImageNode {
  public dimensions: NodeSetting;
  public color: NodeSetting;

  constructor() {
    super("Blank Image");
    this.dimensions = this.AddSetting("dimensions", "point", new Point(512, 512));
    this.color = this.AddSetting("color", "color", new Color(255, 255, 255, 255));
    this.updateHeight();
  }

  public Process() : void {
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