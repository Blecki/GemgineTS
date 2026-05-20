import { ValueNode } from "../ValueNode.js";
import { Color } from "../../Color.js";
import { AssetStore } from "../../AssetStore.js";
export class ColorNode extends ValueNode {
    constructor(assetStore) {
        super("color", new Color(0, 0, 0, 255), assetStore);
    }
}
//# sourceMappingURL=ColorNode.js.map