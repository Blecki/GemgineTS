import { Node } from "./Node.js";
import { OutputTerminal } from "./OutputTerminal.js";
import { InputTerminal } from "./InputTerminal.js";
import { NodeConnection } from "./NodeConnection.js";

export class NodeSet {
  public nodes: Node[] = [];
  public connections: NodeConnection[] = [];
  
  public getPossibleInputConnections(type: String) : InputTerminal[] {
    let r: InputTerminal[] = [];
    this.nodes.forEach(n => {
      n.inputs.forEach(t => {
        if (t.type == type) r.push(t);
      });
    });
    return r;
  }

  public getPossibleOutputConnections(type: String) : OutputTerminal[] {
    let r: OutputTerminal[] = [];
    this.nodes.forEach(n => {
      n.outputs.forEach(t => {
        if (t.type == type) r.push(t);
      });
    });
    return r;
  }

  public addConnection(start: OutputTerminal, end: InputTerminal) {
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
