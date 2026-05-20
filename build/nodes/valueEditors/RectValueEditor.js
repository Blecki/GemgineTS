import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Point } from "../../Point.js";
import { EditorContext } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
export class RectValueEditor extends ValueEditor {
    rawX = "0";
    rawY = "0";
    rawW = "0";
    rawH = "0";
    getDimensions() {
        return new Point(80, 48);
    }
    draw(ctx, editor, drawArea) {
        this.rawX = editor.numberField(new Rect(drawArea.x + 20, drawArea.y, 60, 24), this.rawX);
        this.rawY = editor.numberField(new Rect(drawArea.x + 120, drawArea.y, 60, 24), this.rawY);
        this.rawW = editor.numberField(new Rect(drawArea.x + 20, drawArea.y + 24, 60, 24), this.rawW);
        this.rawH = editor.numberField(new Rect(drawArea.x + 120, drawArea.y + 24, 60, 24), this.rawH);
        ctx.drawString("x", new Point(drawArea.x, drawArea.y), "#ffffff");
        ctx.drawString("y", new Point(drawArea.x + 100, drawArea.y), "#ffffff");
        ctx.drawString("w", new Point(drawArea.x, drawArea.y + 24), "#ffffff");
        ctx.drawString("h", new Point(drawArea.x + 100, drawArea.y + 24), "#ffffff");
    }
    setValue(v) {
        this.rawX = `${v.x}`;
        this.rawY = `${v.y}`;
        this.rawW = `${v.width}`;
        this.rawH = `${v.height}`;
    }
    getValue() {
        let x = parseInt(this.rawX);
        let y = parseInt(this.rawY);
        let w = parseInt(this.rawW);
        let h = parseInt(this.rawH);
        return new Rect(x, y, w, h);
    }
    deserialize(v) {
        this.setValue(new Rect(v));
    }
}
//# sourceMappingURL=RectValueEditor.js.map