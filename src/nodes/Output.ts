import { AssetStore } from "../AssetStore.js";
import { InputTerminal } from "./InputTerminal.js";
import { ImageNode } from "./ImageNode.js";
import type { enqueueNodeForUpdateCallback } from "./Node.js";

export class Output extends ImageNode {
  public input: InputTerminal;

  constructor(assetStore: AssetStore) {
    super("Output", "Output", assetStore);
    this.input = this.AddInput("input", "image");
    this.updateHeight();
  }

  public Process(callback: enqueueNodeForUpdateCallback) : void {
    if (this.checkInputs(callback))
      this.setOutputImage(this.input.getValue());
  }
}