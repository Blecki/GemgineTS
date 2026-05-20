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
    anchorPoint;
    drawArea;
    error = false;
    required = true;
    connection = null;
    constructor(name, type, node, id) {
        this.name = name;
        this.type = type;
        this.node = node;
        this.id = id;
        this.anchorPoint = new Point(0, 0);
        this.drawArea = new Rect(0, 0, 100, 48);
    }
    getValue() {
        if (this.connection != null)
            return this.connection.getValue();
        return null;
    }
    getSourceNode() {
        return this.connection?.startTerminal?.node;
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
        return new Point(100, 24);
    }
    setDrawArea(rect) {
        this.drawArea = rect;
        this.anchorPoint = new Point(this.drawArea.x + 12, this.drawArea.y + 12);
    }
    draw(ctx, editor, nodeSet, guiAssets) {
        //ctx.drawRectangle(this.drawArea, "#292929");
        if (this.error) {
            if (guiAssets.alertIcon != null)
                ctx.drawImage(guiAssets.alertIcon, new Rect(0, 0, 32, 32), new Point(this.drawArea.x + 24, this.drawArea.y));
            ctx.drawString(this.name, new Point(this.drawArea.x + 56, this.drawArea.y), "#ffffff");
        }
        else
            ctx.drawString(this.name, new Point(this.drawArea.x + 24, this.drawArea.y), "#ffffff");
        editor.translateHandle(new Rect(this.drawArea.x + 6, this.drawArea.y + 6, 12, 12), new HandleProperties("#b08026", "#f99d1c")).ifDragged(handle => {
            ctx.drawLine(this.anchorPoint, handle.mousePosition, "red"); // Eventually these need to be drawn to a different canvas layer.
        });
    }
}
//# sourceMappingURL=InputTerminal.js.map