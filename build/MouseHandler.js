import {} from "./Fluent.js";
import { Point } from "./Point.js";
export class MouseState {
    position = new Point(0, 0);
    pressed = false;
    clone() {
        let r = new MouseState();
        r.pressed = this.pressed;
        r.position = this.position;
        return r;
    }
}
export class MouseHandler {
    previousMouse = new MouseState();
    currentMouse = new MouseState();
    mouseDelta = new Point(0, 0);
    camera;
    constructor(element, camera) {
        this.camera = camera;
        element.addEventListener('mousedown', (e) => {
            const rect = element.getBoundingClientRect();
            this.currentMouse.pressed = e.buttons == 1;
            this.currentMouse.position = this.camera.screenToWorld(new Point(e.offsetX, e.offsetY));
        });
        element.addEventListener('mousemove', (e) => {
            const rect = element.getBoundingClientRect();
            this.currentMouse.pressed = e.buttons == 1;
            this.currentMouse.position = this.camera.screenToWorld(new Point(e.offsetX, e.offsetY));
        });
        element.addEventListener('mouseup', (e) => {
            const rect = element.getBoundingClientRect();
            this.currentMouse.pressed = false;
            this.currentMouse.position = this.camera.screenToWorld(new Point(e.offsetX, e.offsetY));
        });
    }
    update() {
        this.mouseDelta = this.currentMouse.position.sub(this.previousMouse.position);
        this.previousMouse = this.currentMouse.clone();
    }
}
//# sourceMappingURL=MouseHandler.js.map