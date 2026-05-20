import { AssetStore } from "../../AssetStore.js";
import { InputTerminal } from "../InputTerminal.js";
import { ImageNode } from "./ImageNode.js";
export class Output extends ImageNode {
    input;
    constructor(assetStore) {
        super("OUTPUT", "Output", assetStore);
        this.input = this.AddInput("input", "image");
        this.updateHeight();
    }
    Process() {
        this.setOutputImage(this.input.getValue());
    }
}
//# sourceMappingURL=Output.js.map