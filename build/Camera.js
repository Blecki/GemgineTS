import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
export class Camera {
    position = new Point(0, 0);
    drawOffset = new Point(0, 0);
    confineToVisibleBounds(bounds, screenSize) {
        let boundsCenter = new Point(bounds.x + (bounds.width / 2), bounds.y + (bounds.height / 2));
        let allowedDeviation = new Point(bounds.width - screenSize.x, bounds.height - screenSize.y);
        let newBounds = new Rect(boundsCenter.x - (allowedDeviation.x / 2), boundsCenter.y - (allowedDeviation.y / 2), allowedDeviation.x, allowedDeviation.y);
        this.confineToBounds(newBounds);
    }
    confineToBounds(bounds) {
        if (this.position.x < bounds.x)
            this.position.x = bounds.x;
        if (this.position.x >= bounds.x + bounds.width)
            this.position.x = bounds.x + bounds.width;
        if (this.position.y < bounds.y)
            this.position.y = bounds.y;
        if (this.position.y >= bounds.y + bounds.height)
            this.position.y = bounds.y + bounds.height;
    }
}
//# sourceMappingURL=Camera.js.map