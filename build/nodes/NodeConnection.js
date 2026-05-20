import { OutputTerminal } from "./OutputTerminal.js";
import { InputTerminal } from "./InputTerminal.js";
export class NodeConnection {
    startTerminal = null;
    endTerminal = null;
    getValue() {
        if (this.startTerminal != null)
            return this.startTerminal.getValue();
        return null;
    }
    serialize() {
        return {
            START_NODE: this.startTerminal?.node.serialization_id,
            START_TERMINAL: this.startTerminal?.name,
            END_NODE: this.endTerminal?.node.serialization_id,
            END_TERMINAL: this.endTerminal?.name
        };
    }
}
//# sourceMappingURL=NodeConnection.js.map