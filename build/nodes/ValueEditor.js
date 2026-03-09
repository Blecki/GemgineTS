import { Rect } from "../Rect.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { Fluent } from "../Fluent.js";
export function valueEditorFactory(type) {
    switch (type) {
        case "image": return new ValueEditor();
        case "number": return new NumberValueEditor();
        default: return new ValueEditor();
    }
}
export class ValueEditor {
    element = null;
    constructor() { }
    getElement(fluent) {
        if (this.element == null) {
            this.element = fluent.span();
            document.documentElement.appendChild(this.element);
        }
        return this.element;
    }
    getDimensions() {
        return new Point(80, 24);
    }
}
export class NumberValueEditor extends ValueEditor {
    constructor() {
        super();
    }
    getElement(fluent) {
        if (this.element == null) {
            this.element = fluent.input('number')._style({ position: "absolute", width: "80px" });
            document.documentElement.appendChild(this.element);
        }
        return this.element;
    }
}
//# sourceMappingURL=ValueEditor.js.map