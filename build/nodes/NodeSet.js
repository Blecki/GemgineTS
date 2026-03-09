import { Node } from "./Node.js";
import { OutputTerminal } from "./OutputTerminal.js";
import { InputTerminal } from "./InputTerminal.js";
import { NodeConnection } from "./NodeConnection.js";
export class NodeSet {
    nodes = [];
    connections = [];
    getPossibleInputConnections(type) {
        let r = [];
        this.nodes.forEach(n => {
            n.inputs.forEach(t => {
                if (t.type == type)
                    r.push(t);
            });
        });
        return r;
    }
    getPossibleOutputConnections(type) {
        let r = [];
        this.nodes.forEach(n => {
            n.outputs.forEach(t => {
                if (t.type == type)
                    r.push(t);
            });
        });
        return r;
    }
    addConnection(start, end) {
        if (end.connection != null) {
            let toRemove = end.connection;
            end.disconnect();
            toRemove.startTerminal?.disconnect();
            this.connections = this.connections.filter(c => c !== toRemove);
        }
        let newConnection = new NodeConnection();
        start.connect(newConnection);
        end.connect(newConnection);
        this.connections.push(newConnection);
    }
}
//# sourceMappingURL=NodeSet.js.map