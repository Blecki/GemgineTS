import { InputTerminal } from "../InputTerminal.js";
import { ImageNode } from "./ImageNode.js";
export class Output extends ImageNode {
    input;
    constructor() {
        super("Output");
        this.input = this.AddInput("input", "image");
        this.AddInput("test", "number");
        this.updateHeight();
    }
    Process() {
        this.setOutputImage(this.input.getValue());
    }
}
//# sourceMappingURL=Output.js.map