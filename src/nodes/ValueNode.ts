import { Node, type enqueueNodeForUpdateCallback } from "./Node.js";
import { NodeSetting } from "./NodeSetting.js";
import { AssetStore } from "../AssetStore.js";
import type { OutputTerminal } from "./OutputTerminal.js";

export class ValueNode extends Node {
  public value: NodeSetting;
  public output: OutputTerminal;

  constructor(type: string, defaultValue: any, assetStore: AssetStore) {
    super(type.charAt(0).toUpperCase() + type.slice(1), type, assetStore);
    this.value = this.AddSetting("value", type, defaultValue, assetStore);
    this.output = this.AddOutput("out", type);
    this.updateHeight();
  }

  public Process(callback: enqueueNodeForUpdateCallback) : void {
    this.output.setValue(this.value.getValue());
  }  
}