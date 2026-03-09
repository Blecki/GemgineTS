import { type Vector3, Vector3Raw } from "../../gl/Vector3.js";
import { Rect } from "../../Rect.js";
import { ImageNode } from "./ImageNode.js";
import { EditorContext } from "../../editor/EditorContext.js";
import { NodeSet } from "../NodeSet.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { InputTerminal } from "../InputTerminal.js";

export class Rectangle extends ImageNode {
  public rect: Rect = new Rect(32, 32, 32, 32);

  public inputImage: InputTerminal;
  public inputRect: InputTerminal;
  public inputColor: InputTerminal;

  constructor() {
    super("rect");
    this.inputImage = this.AddInput("image", "image");
    this.inputRect = this.AddInput("rect", "Rect");
    this.inputColor = this.AddInput("color", "Vector3");
    this.updateHeight();
  }

  public Process() : void {
    let inputImage = this.inputImage.getValue() as ImageData;
    if (inputImage != null) {
      let inputRect = this.inputRect.getValue() as Rect;
      let inputColor = this.inputColor.getValue() as Vector3;
      let output = new ImageData(inputImage.data, inputImage.width, inputImage.height);
      let pixels = output.data;
      
      for (let x = Math.max(0, inputRect.x); x < Math.min(inputImage.width, inputRect.x + inputRect.width); ++x)
        for (let y = Math.max(0, inputRect.y); y < Math.min(inputImage.height, inputRect.y + inputRect.height); ++y) {
          let i = (y * inputImage.width * 4) + (x * 4);
          pixels[i] = inputColor.x;
          pixels[i+1] = inputColor.y;
          pixels[i+2] = inputColor.z;
          pixels[i+3] = 255;
        }

      this.setOutputImage(output);
    }
  }

  public draw(ctx: RenderTarget2D, editor: EditorContext, nodeEditor: NodeSet) {
    super.draw(ctx, editor, nodeEditor);


  }
}