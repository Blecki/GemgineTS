import { NodeConnection } from "./NodeConnection.js";
import { Node } from "./Node.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { Rect } from "../Rect.js";
import type { GuiAssets } from "./GuiAssets.js";

export class InputTerminal {
  public node: Node;
  public id: number;
  public name: string;
  public type: string;
  public anchorPoint: Point;
  public drawArea: Rect;
  public error: boolean = false;
  public required: boolean = true;

  public connection: NodeConnection | null = null;

  constructor(name: string, type: string, node: Node, id: number) {
    this.name = name;
    this.type = type;
    this.node = node;
    this.id = id;
    this.anchorPoint = new Point(0,0);
    this.drawArea = new Rect(0,0,100,48);
  }

  public getValue() : any {
    if (this.connection != null)
      return this.connection.getValue();
    return null;
  }

  public getSourceNode() : Node | undefined {
    return this.connection?.startTerminal?.node;
  }

  public connect(connection: NodeConnection) {
    this.connection = connection;
    this.connection.endTerminal = this;
  }

  public disconnect() {
    if (this.connection != null) {
      this.connection.endTerminal = null;
      this.connection = null;
    }
  }

  getDimensions() : Point {
    return new Point(100, 24);
  }

  setDrawArea(rect: Rect) : void {
    this.drawArea = rect;
    this.anchorPoint = new Point(this.drawArea.x + 12, this.drawArea.y + 12);
  }

  public draw(ctx: RenderTarget2D, editor: EditorContext, nodeSet: NodeSet, guiAssets: GuiAssets) {
    //ctx.drawRectangle(this.drawArea, "#292929");
    if (this.error) {
      if (guiAssets.alertIcon != null) ctx.drawImage(guiAssets.alertIcon, new Rect(0,0,32,32), new Point(this.drawArea.x + 24, this.drawArea.y));
      ctx.drawString(this.name, new Point(this.drawArea.x + 56, this.drawArea.y), "#ffffff");
    }
    else
      ctx.drawString(this.name, new Point(this.drawArea.x + 24, this.drawArea.y), "#ffffff");

    editor.translateHandle(new Rect(this.drawArea.x + 6, this.drawArea.y + 6, 12, 12), new HandleProperties("#b08026", "#f99d1c")).ifDragged(handle => {
      ctx.drawLine(this.anchorPoint, handle.mousePosition, "red"); // Eventually these need to be drawn to a different canvas layer.
    });
  }
}
