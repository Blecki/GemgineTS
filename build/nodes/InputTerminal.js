import { valueEditorFactory, ValueEditor } from "./ValueEditor.js";
import { NodeConnection } from "./NodeConnection.js";
import { Node } from "./Node.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { Rect } from "../Rect.js";
export class InputTerminal {
    node;
    id;
    name;
    type;
    defaultValue;
    valueEditor;
    anchorPoint;
    drawArea;
    connection = null;
    constructor(name, type, node, id) {
        this.name = name;
        this.type = type;
        this.node = node;
        this.id = id;
        this.valueEditor = valueEditorFactory(this.type);
        this.anchorPoint = new Point(0, 0);
        this.drawArea = new Rect(0, 0, 100, 48);
    }
    getValue() {
        if (this.connection != null)
            return this.connection.value;
        return this.defaultValue;
    }
    connect(connection) {
        this.connection = connection;
        this.connection.endTerminal = this;
    }
    disconnect() {
        if (this.connection != null) {
            this.connection.endTerminal = null;
            this.connection = null;
        }
    }
    getDimensions() {
        let valueEditorDimensions = this.valueEditor.getDimensions();
        return new Point(100, 24 + valueEditorDimensions.y);
    }
    setDrawArea(rect) {
        this.drawArea = rect;
        this.anchorPoint = new Point(this.drawArea.x + 12, this.drawArea.y + 12);
    }
    draw(ctx, editor, nodeSet) {
        ctx.drawRectangle(this.drawArea, "#292929");
        ctx.drawString(this.name, new Point(this.drawArea.x + 24, this.drawArea.y), "#ffffff");
        let inputElement = this.valueEditor.getElement(editor.fluent);
        let screenPos = editor.camera.worldPointToScreen(new Point(this.drawArea.x + 4, this.drawArea.y + 24));
        inputElement.style.left = screenPos.x.toString();
        inputElement.style.top = screenPos.y.toString();
        editor.translateHandle(new Rect(this.drawArea.x + 6, this.drawArea.y + 6, 12, 12), new HandleProperties("#b08026", "#f99d1c")).ifDragged(handle => {
            ctx.drawLine(this.anchorPoint, handle.mousePosition, "red"); // Eventually these need to be drawn to a different canvas layer.
        });
    }
}
//# sourceMappingURL=InputTerminal.js.map