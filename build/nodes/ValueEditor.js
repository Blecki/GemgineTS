import { Rect } from "../Rect.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
export class ValueEditor {
    cachedValue;
    constructor() { }
    getDimensions() {
        return new Point(80, 24);
    }
    getValue() {
        return this.cachedValue;
    }
    setValue(v) {
        this.cachedValue = v;
    }
    draw(ctx, editor, drawArea) { }
}
//# sourceMappingURL=ValueEditor.js.map