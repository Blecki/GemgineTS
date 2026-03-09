import { InputTerminal } from "../InputTerminal.js";
import { ImageNode } from "./ImageNode.js";

export class Output extends ImageNode {
  public input: InputTerminal;

  constructor() {
    super("output");
    this.input = this.AddInput("input", "image");
    this.AddInput("test", "number");
    this.updateHeight();
  }

  public Process() : void {
    this.setOutputImage(this.input.getValue());
  }
}