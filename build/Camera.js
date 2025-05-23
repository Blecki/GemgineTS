import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
export class Camera {
    position = new Point(0, 0);
    drawOffset = new Point(0, 0);
    bounds = new Rect(-0.5, -0.5, 1, 1);
}
//# sourceMappingURL=Camera.js.map