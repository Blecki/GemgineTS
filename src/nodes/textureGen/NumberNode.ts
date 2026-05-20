import { ValueNode } from "../ValueNode.js";
import { AssetStore } from "../../AssetStore.js";

export class NumberNode extends ValueNode {
  constructor(assetStore: AssetStore) {
    super("number", 0, assetStore);
  } 
}