import { AssetStore } from "../AssetStore.js";
import { InputTerminal } from "./InputTerminal.js";
import { ImageNode } from "./ImageNode.js";
export class Output extends ImageNode {
    input;
    constructor(assetStore) {
        super("Output", "Output", assetStore);
        this.input = this.AddInput("input", "image");
        this.updateHeight();
    }
    Process(callback) {
        if (this.checkInputs(callback))
            this.setOutputImage(this.input.getValue());
    }
}
//# sourceMappingURL=Output.js.map