import { ValueEditor } from "./ValueEditor.js";
import { valueEditorFactory } from "./ValueEditorFactory.js";
import { NodeConnection } from "./NodeConnection.js";
import { Node } from "./Node.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { Rect } from "../Rect.js";
import { AssetStore } from "../AssetStore.js";
export class NodeSetting {
    node;
    id;
    name;
    type;
    valueEditor;
    drawArea;
    constructor(name, type, node, id, value, assetStore) {
        this.name = name;
        this.type = type;
        this.node = node;
        this.id = id;
        this.valueEditor = valueEditorFactory(this.type, assetStore);
        this.valueEditor.setValue(value);
        this.drawArea = new Rect(0, 0, 200, 48);
    }
    serialize() {
        return this.valueEditor.serialize();
    }
    deserialize(value) {
        this.valueEditor.deserialize(value);
    }
    getValue() {
        return this.valueEditor.getValue();
    }
    getDimensions() {
        let valueEditorDimensions = this.valueEditor.getDimensions();
        return new Point(214, 24 + valueEditorDimensions.y);
    }
    setDrawArea(rect) {
        this.drawArea = rect;
    }
    draw(ctx, editor, nodeSet) {
        //ctx.drawRectangle(this.drawArea, "#292929");
        ctx.drawString(this.name, new Point(this.drawArea.x, this.drawArea.y), "#ffffff");
        this.valueEditor.draw(ctx, editor, this.drawArea.lrtb(4, -4, 24, -2));
    }
}
//# sourceMappingURL=NodeSetting.js.map