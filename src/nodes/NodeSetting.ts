import { ValueEditor } from "./ValueEditor.js";
import { valueEditorFactory } from "./ValueEditorFactory.js";
import { NodeConnection } from "./NodeConnection.js";
import { Node } from "./Node.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { Rect } from "../Rect.js";

export class NodeSetting {
  public node: Node;
  public id: number;
  public name: string;
  public type: string;
  public valueEditor: ValueEditor;
  public drawArea: Rect;


  constructor(name: string, type: string, node: Node, id: number, value: any) {
    this.name = name;
    this.type = type;
    this.node = node;
    this.id = id;
    this.valueEditor = valueEditorFactory(this.type);
    this.valueEditor.setValue(value);
    this.drawArea = new Rect(0,0,200,48);
  }

  public getValue() : any {
    return this.valueEditor.getValue();
  }

  getDimensions() : Point {
    let valueEditorDimensions = this.valueEditor.getDimensions();
    return new Point(200, 24 + valueEditorDimensions.y);
  }

  setDrawArea(rect: Rect) : void {
    this.drawArea = rect;
  }

  public draw(ctx: RenderTarget2D, editor: EditorContext, nodeSet: NodeSet) {
    ctx.drawRectangle(this.drawArea, "#292929");
    ctx.drawString(this.name, new Point(this.drawArea.x, this.drawArea.y), "#ffffff");
    this.valueEditor.draw(ctx, editor, this.drawArea.lrtb(4, -4, 24, -2));
  }
}
