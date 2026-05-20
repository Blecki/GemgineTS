import { OutputTerminal } from "./OutputTerminal.js";
import { InputTerminal } from "./InputTerminal.js";

export type NodeConnectionPrototype = {
  START_NODE: number;
  START_TERMINAL: string;
  END_NODE: number;
  END_TERMINAL: string;
}

export class NodeConnection {
  public startTerminal: OutputTerminal | null = null;
  public endTerminal: InputTerminal | null = null;
  
  public getValue() : any {
    if (this.startTerminal != null)
      return this.startTerminal.getValue();
    return null;
  }

  public serialize() : object {
    return {
      START_NODE: this.startTerminal?.node.serialization_id,
      START_TERMINAL: this.startTerminal?.name,
      END_NODE: this.endTerminal?.node.serialization_id,
      END_TERMINAL: this.endTerminal?.name
    };
  }
}
