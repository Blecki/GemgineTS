import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Point } from "../../Point.js";
import { EditorContext } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { Color } from "../../Color.js";
export class ColorValueEditor extends ValueEditor {
    rawR = "0";
    rawG = "0";
    rawB = "0";
    rawA = "0";
    getDimensions() {
        return new Point(80, 48);
    }
    draw(ctx, editor, drawArea) {
        this.rawR = editor.numberField(new Rect(drawArea.x + 20, drawArea.y, 60, 24), this.rawR);
        this.rawG = editor.numberField(new Rect(drawArea.x + 120, drawArea.y, 60, 24), this.rawG);
        this.rawB = editor.numberField(new Rect(drawArea.x + 20, drawArea.y + 24, 60, 24), this.rawB);
        this.rawA = editor.numberField(new Rect(drawArea.x + 120, drawArea.y + 24, 60, 24), this.rawA);
        ctx.drawString("r", new Point(drawArea.x, drawArea.y), "#ffffff");
        ctx.drawString("g", new Point(drawArea.x + 100, drawArea.y), "#ffffff");
        ctx.drawString("b", new Point(drawArea.x, drawArea.y + 24), "#ffffff");
        ctx.drawString("a", new Point(drawArea.x + 100, drawArea.y + 24), "#ffffff");
    }
    setValue(v) {
        this.rawR = `${v.r}`;
        this.rawG = `${v.g}`;
        this.rawB = `${v.b}`;
        this.rawA = `${v.a}`;
    }
    getValue() {
        let r = parseInt(this.rawR);
        let g = parseInt(this.rawG);
        let b = parseInt(this.rawB);
        let a = parseInt(this.rawA);
        return new Color(r, g, b, a);
    }
    deserialize(v) {
        this.setValue(new Color(v));
    }
}
//# sourceMappingURL=ColorValueEditor.js.map