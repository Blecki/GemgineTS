import { EditorContext } from "./EditorContext.js";
import { EditorGizmo } from "./EditorGizmo.js";
import { Point } from "./Point.js";
import { RenderTarget } from "./RenderTarget.js";
import { Rect } from "./Rect.js";
export class EditorHandle extends EditorGizmo {
    constructor(position) {
        super(position);
    }
    get bounds() {
        return new Rect(this.position.x - 2, this.position.y - 2, 5, 5);
    }
    draw(target, context) {
        if (context.selectedGizmo === this)
            target.drawRectangle(this.bounds, "yellow");
        target.drawWireRectangle(this.bounds, "orange");
    }
}
//# sourceMappingURL=EditorHandle.js.map