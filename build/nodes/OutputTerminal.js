import { NodeConnection } from "./NodeConnection.js";
import { Node } from "./Node.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { Rect } from "../Rect.js";
import { InputTerminal } from "./InputTerminal.js";
export class OutputTerminal {
    node;
    id;
    name;
    type;
    value = null;
    connection = null;
    anchorPoint;
    drawArea;
    constructor(name, type, node, id) {
        this.name = name;
        this.type = type;
        this.node = node;
        this.id = id;
        this.anchorPoint = new Point(0, 0);
        this.drawArea = new Rect(0, 0, 100, 48);
    }
    setValue(value) {
        this.value = value;
    }
    getValue() {
        return this.value;
    }
    connect(connection) {
        this.connection = connection;
        this.connection.startTerminal = this;
    }
    disconnect() {
        if (this.connection != null) {
            this.connection.startTerminal = null;
            this.connection = null;
        }
    }
    getDimensions() {
        return new Point(100, 24);
    }
    setDrawArea(rect) {
        this.drawArea = rect;
        this.anchorPoint = new Point(this.drawArea.x + this.drawArea.width - 12, this.drawArea.y + 12);
    }
    draw(ctx, editor, nodeSet) {
        //ctx.drawRectangle(this.drawArea, "#292929");
        ctx.drawString(this.name, new Point(this.drawArea.x + 4, this.drawArea.y), "#ffffff");
        let snappedTerminal = null;
        editor.widget(new Rect(this.anchorPoint.x - 6, this.anchorPoint.y - 6, 12, 12))
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
            .ifMouseUp(handle => {
            if (snappedTerminal != null) {
                nodeSet.addConnection(this, snappedTerminal);
            }
        });
    }
}
//# sourceMappingURL=OutputTerminal.js.map