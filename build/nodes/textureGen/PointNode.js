import { ValueNode } from "../ValueNode.js";
import { Point } from "../../Point.js";
import { AssetStore } from "../../AssetStore.js";
export class PointNode extends ValueNode {
    constructor(assetStore) {
        super("point", new Point(0, 0), assetStore);
    }
}
//# sourceMappingURL=PointNode.js.map