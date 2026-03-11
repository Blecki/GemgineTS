import { type Vector3, Vector3Raw } from "../../gl/Vector3.js";
import { Rect } from "../../Rect.js";
import { Node } from "../Node.js";
import { EditorContext } from "../../editor/EditorContext.js";
import { NodeSet } from "../NodeSet.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { InputTerminal } from "../InputTerminal.js";
import { NodeSetting } from "../NodeSetting.js";
import type { OutputTerminal } from "../OutputTerminal.js";

export class Rectangle extends Node {
  public settingRect: NodeSetting;
  public outputRect: OutputTerminal;

  constructor() {
    super("rect");
    this.settingRect = this.AddSetting("rect", "rect", new Rect(32, 32, 32, 32));
    this.outputRect = this.AddOutput("rect", "rect");
    this.updateHeight();
  }

  public Process() : void {
    this.outputRect.setValue(this.settingRect.getValue);
  }
}