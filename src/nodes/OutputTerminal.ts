import { NodeConnection } from "./NodeConnection.js";
import { Node } from "./Node.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { Rect } from "../Rect.js";
import { InputTerminal } from "./InputTerminal.js";

export class OutputTerminal {
  public node: Node;
  public id: number;
  public name: string;
  public type: string;
  public value: any = null;
  public connection: NodeConnection | null = null;
  public anchorPoint: Point;
  public drawArea: Rect;

  constructor(name: string, type: string, node: Node, id: number) {
    this.name = name;
    this.type = type;
    this.node = node;
    this.id = id;
    this.anchorPoint = new Point(0,0);
    this.drawArea = new Rect(0,0,100,48);
  }

  public setValue(value: any) {
    this.value = value;
  }
  
  public getValue() : any {
    return this.value;
  }

  public connect(connection: NodeConnection) {
    this.connection = connection;
    this.connection.startTerminal = this;
  }
  
  public disconnect() {
    if (this.connection != null) {
      this.connection.startTerminal = null;
      this.connection = null;
    }
  }

  getDimensions() : Point {
    return new Point(100, 24);
  }

  setDrawArea(rect: Rect) : void {
    this.drawArea = rect;
    this.anchorPoint = new Point(this.drawArea.x + this.drawArea.width - 12, this.drawArea.y + 12);
  }


  public draw(ctx: RenderTarget2D, editor: EditorContext, nodeSet: NodeSet) {
    ctx.drawRectangle(this.drawArea, "#292929");
    ctx.drawString(this.name, new Point(this.drawArea.x + 4, this.drawArea.y), "#ffffff");

    let snappedTerminal: InputTerminal | null = null;
    editor.handleSize = 3;
    editor.translateHandle(new Rect(this.anchorPoint.x - 6, this.anchorPoint.y - 6, 12, 12), new HandleProperties("#b08026", "#f99d1c"))
      .ifDragged(handle => {
        let possibleInputs = nodeSet.getPossibleInputConnections(this.type);
        let inputPositions = possibleInputs.map(pi => pi.anchorPoint);
        let minimumDistance = Infinity;
        let minIndex = -1;
        for (let x = 0; x < inputPositions.length; ++x) {
          let distance = Point.distance(handle.mousePosition, inputPositions[x]);
          if (distance < minimumDistance) {
            minimumDistance = distance;
            minIndex = x;
          }
        }
        if (minIndex == -1 || minimumDistance > 100) {
          snappedTerminal = null;
          ctx.drawLine(this.anchorPoint, handle.mousePosition, "red");
        } 
        else {
          snappedTerminal = possibleInputs[minIndex];
          ctx.drawLine(this.anchorPoint, inputPositions[minIndex], "green");
        }
      })
      .ifReleased(handle => {
        if (snappedTerminal != null) {
          nodeSet.addConnection(this, snappedTerminal);
        }
      });
  }
}