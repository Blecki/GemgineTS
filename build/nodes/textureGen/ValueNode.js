import { Node } from "../Node.js";
import { Color } from "../../Color.js";
import { NodeSetting } from "../NodeSetting.js";
import { Gradient, GradientPoint } from "../../Gradient.js";
import { AssetStore } from "../../AssetStore.js";
export class ValueNode extends Node {
    value;
    output;
    constructor(type, defaultValue, assetStore) {
        super("GRADIENT", "Gradient", assetStore);
        this.value = this.AddSetting("value", type, defaultValue, assetStore);
        this.output = this.AddOutput("out", type);
        this.updateHeight();
    }
    Process() {
        this.output.setValue(this.value.getValue());
    }
}
//# sourceMappingURL=ValueNode.js.map