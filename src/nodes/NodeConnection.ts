import { OutputTerminal } from "./OutputTerminal.js";
import { InputTerminal } from "./InputTerminal.js";

export class NodeConnection {
  public startTerminal: OutputTerminal | null = null;
  public endTerminal: InputTerminal | null = null;
  public value: any = null;
}
