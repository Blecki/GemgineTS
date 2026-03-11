import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent } from "../../Fluent.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
export class NumberValueEditor extends ValueEditor {
    element = null;
    constructor() {
        super();
        this.element = Fluent.input('number')._style({ position: "absolute", width: "80px" });
        document.documentElement.appendChild(this.element);
    }
    draw(ctx, editor, drawArea) {
        if (this.element) {
            let pos = editor.camera.worldPointToScreen(drawArea.origin);
            this.element.style.left = pos.x.toString();
            this.element.style.top = pos.y.toString();
        }
    }
    setValue(v) {
        if (this.element)
            this.element.value = v;
    }
    getValue() {
        if (this.element && this.element.value != "")
            return Number(this.element.value);
        return 0;
    }
}
//# sourceMappingURL=NumberValueEditor.js.map