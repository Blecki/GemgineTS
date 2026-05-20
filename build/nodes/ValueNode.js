import { Node } from "./Node.js";
import { NodeSetting } from "./NodeSetting.js";
import { AssetStore } from "../AssetStore.js";
export class ValueNode extends Node {
    value;
    output;
    constructor(type, defaultValue, assetStore) {
        super(type.charAt(0).toUpperCase() + type.slice(1), type, assetStore);
        this.value = this.AddSetting("value", type, defaultValue, assetStore);
        this.output = this.AddOutput("out", type);
        this.updateHeight();
    }
    Process(callback) {
        this.output.setValue(this.value.getValue());
    }
}
//# sourceMappingURL=ValueNode.js.map