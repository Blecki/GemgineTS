import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent } from "../../Fluent.js";
import { Point } from "../../Point.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
export class PointValueEditor extends ValueEditor {
    xElement = null;
    yElement = null;
    constructor() {
        super();
        this.xElement = Fluent.input('number')._style({ position: "absolute", width: "60px" });
        document.documentElement.appendChild(this.xElement);
        this.yElement = Fluent.input('number')._style({ position: "absolute", width: "60px" });
        document.documentElement.appendChild(this.yElement);
    }
    draw(ctx, editor, drawArea) {
        if (this.xElement) {
            let pos = editor.camera.worldPointToScreen(new Point(drawArea.x + 20, drawArea.y));
            this.xElement.style.left = pos.x.toString();
            this.xElement.style.top = pos.y.toString();
        }
        if (this.yElement) {
            let pos = editor.camera.worldPointToScreen(new Point(drawArea.x + 120, drawArea.y));
            this.yElement.style.left = pos.x.toString();
            this.yElement.style.top = pos.y.toString();
        }
        ctx.drawString("x", new Point(drawArea.x, drawArea.y), "#ffffff");
        ctx.drawString("y", new Point(drawArea.x + 100, drawArea.y), "#ffffff");
    }
    setValue(v) {
        if (this.xElement)
            this.xElement.value = v.x;
        if (this.yElement)
            this.yElement.value = v.y;
    }
    getValue() {
        let x = 0;
        let y = 0;
        if (this.xElement && this.xElement.value != "")
            x = Number(this.xElement.value);
        if (this.yElement && this.yElement.value != "")
            y = Number(this.yElement.value);
        return new Point(x, y);
    }
}
//# sourceMappingURL=PointValueEditor.js.map