import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent } from "../../Fluent.js";
import { Point } from "../../Point.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
export class RectValueEditor extends ValueEditor {
    xElement = null;
    yElement = null;
    wElement = null;
    hElement = null;
    constructor() {
        super();
        this.xElement = Fluent.input('number')._style({ position: "absolute", width: "60px" });
        document.documentElement.appendChild(this.xElement);
        this.yElement = Fluent.input('number')._style({ position: "absolute", width: "60px" });
        document.documentElement.appendChild(this.yElement);
        this.wElement = Fluent.input('number')._style({ position: "absolute", width: "60px" });
        document.documentElement.appendChild(this.wElement);
        this.hElement = Fluent.input('number')._style({ position: "absolute", width: "60px" });
        document.documentElement.appendChild(this.hElement);
    }
    getDimensions() {
        return new Point(80, 48);
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
        if (this.wElement) {
            let pos = editor.camera.worldPointToScreen(new Point(drawArea.x + 20, drawArea.y + 24));
            this.wElement.style.left = pos.x.toString();
            this.wElement.style.top = pos.y.toString();
        }
        if (this.hElement) {
            let pos = editor.camera.worldPointToScreen(new Point(drawArea.x + 120, drawArea.y + 24));
            this.hElement.style.left = pos.x.toString();
            this.hElement.style.top = pos.y.toString();
        }
        ctx.drawString("x", new Point(drawArea.x, drawArea.y), "#ffffff");
        ctx.drawString("y", new Point(drawArea.x + 100, drawArea.y), "#ffffff");
        ctx.drawString("w", new Point(drawArea.x, drawArea.y + 24), "#ffffff");
        ctx.drawString("h", new Point(drawArea.x + 100, drawArea.y + 24), "#ffffff");
    }
    setValue(v) {
        if (this.xElement)
            this.xElement.value = v.r;
        if (this.yElement)
            this.yElement.value = v.g;
        if (this.wElement)
            this.wElement.value = v.b;
        if (this.hElement)
            this.hElement.value = v.a;
    }
    getValue() {
        let x = 0;
        let y = 0;
        let w = 0;
        let h = 0;
        if (this.xElement && this.xElement.value != "")
            x = Number(this.xElement.value);
        if (this.yElement && this.yElement.value != "")
            y = Number(this.yElement.value);
        if (this.wElement && this.wElement.value != "")
            w = Number(this.wElement.value);
        if (this.hElement && this.hElement.value != "")
            h = Number(this.hElement.value);
        return new Rect(x, y, w, h);
    }
}
//# sourceMappingURL=RectValueEditor.js.map