import { NodeConnection } from "./NodeConnection.js";
import { Node } from "./Node.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { Rect } from "../Rect.js";

export class InputTerminal {
  public node: Node;
  public id: number;
  public name: string;
  public type: string;
  public defaultValue: any;
  public anchorPoint: Point;
  public drawArea: Rect;

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
    return this.defaultValue;
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

  public draw(ctx: RenderTarget2D, editor: EditorContext, nodeSet: NodeSet) {
    ctx.drawRectangle(this.drawArea, "#292929");
    ctx.drawString(this.name, new Point(this.drawArea.x + 24, this.drawArea.y), "#ffffff");

    editor.translateHandle(new Rect(this.drawArea.x + 6, this.drawArea.y + 6, 12, 12), new HandleProperties("#b08026", "#f99d1c")).ifDragged(handle => {
      ctx.drawLine(this.anchorPoint, handle.mousePosition, "red"); // Eventually these need to be drawn to a different canvas layer.
    });
  }
}
