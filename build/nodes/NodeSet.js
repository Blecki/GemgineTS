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
    serialize() {
        for (let x = 0; x < this.nodes.length; ++x)
            this.nodes[x].serialization_id = x;
        return {
            NODES: this.nodes.map(n => n.serialize()),
            CONNECTIONS: this.connections.map(c => c.serialize())
        };
    }
    deserialize(data, nodeFactory) {
        let p = data;
        this.nodes = p.NODES != null ? p.NODES.map(n => {
            let nodePrototype = n;
            let node = nodeFactory(nodePrototype.TYPE);
            if (node != undefined)
                node.deserialize(nodePrototype);
            return node;
        }).filter(n => n != undefined) : [];
        this.connections = p.CONNECTIONS != null ? p.CONNECTIONS.map(c => {
            let connectionPrototype = c;
            let r = new NodeConnection();
            r.startTerminal = this.nodes[connectionPrototype.START_NODE].findOutput(connectionPrototype.START_TERMINAL) ?? null;
            r.endTerminal = this.nodes[connectionPrototype.END_NODE].findInput(connectionPrototype.END_TERMINAL) ?? null;
            r.startTerminal?.connect(r);
            r.endTerminal?.connect(r);
            return r;
        }) : [];
    }
}
//# sourceMappingURL=NodeSet.js.map