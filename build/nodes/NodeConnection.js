import { OutputTerminal } from "./OutputTerminal.js";
import { InputTerminal } from "./InputTerminal.js";
export class NodeConnection {
    startTerminal = null;
    endTerminal = null;
    getValue() {
        if (this.startTerminal != null)
            return this.startTerminal.getValue();
        throw "Unconnected Connection Error";
    }
}
//# sourceMappingURL=NodeConnection.js.map