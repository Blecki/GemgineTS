import { EditorContext } from "./EditorContext.js";
import { Point } from "./Point.js";
import { RenderTarget } from "./RenderTarget.js";
import { Rect } from "./Rect.js";
export class RectEditorGizmo {
    rect;
    constructor(rect) {
        this.rect = rect;
    }
    get bounds() {
        return this.rect;
    }
    overlaps(mousePosition) {
        return this.bounds.contains(mousePosition);
    }
    drawSelected(context) {
        context.renderTarget.drawWireRectangle(this.rect, "#69b969");
    }
    drawUnselected(context) {
        context.renderTarget.drawWireRectangle(this.rect, "#999999");
    }
}
//# sourceMappingURL=RectEditorGismo.js.map