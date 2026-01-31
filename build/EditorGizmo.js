import { EditorContext } from "./EditorContext.js";
import { Point } from "./Point.js";
import { RenderTarget } from "./RenderTarget.js";
import { Rect } from "./Rect.js";
export class EditorGizmo {
    position;
    constructor(position) {
        this.position = position;
    }
    get bounds() {
        return new Rect(this.position.x, this.position.y, 1, 1);
    }
    overlaps(mousePosition) {
        return this.bounds.contains(mousePosition);
    }
    drawSelected(context) { }
    drawUnselected(context) { }
}
//# sourceMappingURL=EditorGizmo.js.map