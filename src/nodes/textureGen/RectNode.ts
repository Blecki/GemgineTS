import { ValueNode } from "../ValueNode.js";
import { Rect } from "../../Rect.js";
import { AssetStore } from "../../AssetStore.js";

export class RectNode extends ValueNode {
  constructor(assetStore: AssetStore) {
    super("rect", new Rect(0,0,1,1), assetStore);
  } 
}