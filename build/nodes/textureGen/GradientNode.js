import { ValueNode } from "../ValueNode.js";
import { Color } from "../../Color.js";
import { Gradient, GradientPoint } from "../../Gradient.js";
import { AssetStore } from "../../AssetStore.js";
export class GradientNode extends ValueNode {
    constructor(assetStore) {
        super("gradient", new Gradient([new GradientPoint(0, new Color(0, 255, 0, 255)), new GradientPoint(0.5, new Color(0, 0, 255, 255)), new GradientPoint(1, new Color(255, 0, 0, 255))]), assetStore);
    }
}
//# sourceMappingURL=GradientNode.js.map