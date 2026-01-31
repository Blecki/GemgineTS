import { Point } from "./Point.js";
import { RenderTarget } from "./RenderTarget.js";
import { Camera } from "./Camera.js";
import { MouseHandler } from "./MouseHandler.js";
import { Rect } from "./Rect.js";
export class TransientHandle {
    id = 0;
    dragged = false;
    clicked = false;
    overlapped = false;
    delta = new Point(0, 0);
    ifDragged(callback) {
        if (this.dragged)
            callback();
    }
}
export class TransientRect {
    rect;
    editorContext;
    constructor(rect, editorContext) {
        this.rect = rect;
        this.editorContext = editorContext;
    }
    ifClickedCallback = null;
    ifClicked(callback) {
        this.ifClickedCallback = callback;
    }
    triggerIfClicked() {
        if (this.ifClickedCallback != null)
            this.ifClickedCallback();
    }
}
export class EditorContext {
    mouseHandler;
    renderTarget;
    camera;
    handleSize = 10;
    transientRects = [];
    constructor(camera, renderTarget) {
        this.renderTarget = renderTarget;
        this.camera = camera;
        this.mouseHandler = new MouseHandler(renderTarget.canvas, camera);
    }
    lastTranslateHandleID = 0;
    nextTranslateHandleID = 1;
    anyDragged = false;
    open() {
        this.anyDragged = false;
        this.nextTranslateHandleID = 1;
    }
    close() {
        if (this.anyDragged == false) {
            this.lastTranslateHandleID = 0;
            // User didn't drag with any handles so check for mouse click
            if (this.mouseHandler.previousMouse.pressed == false && this.mouseHandler.currentMouse.pressed == true) {
                let mouseWorldPoint = this.mouseHandler.currentMouse.position;
                let clickedGizmos = this.transientRects.filter(g => g.rect.contains(mouseWorldPoint));
                if (clickedGizmos.length > 0)
                    clickedGizmos[0].triggerIfClicked();
            }
        }
        this.transientRects = [];
        this.mouseHandler.update();
    }
    translateHandle(position) {
        let screenHandleSize = new Point(this.handleSize / this.camera.scale.x, this.handleSize / this.camera.scale.y);
        let handleBounds = new Rect(position.x - (screenHandleSize.x / 2), position.y - (screenHandleSize.y / 2), screenHandleSize.x, screenHandleSize.y);
        let r = new TransientHandle();
        r.id = this.nextTranslateHandleID;
        this.nextTranslateHandleID += 1;
        r.delta = this.mouseHandler.mouseDelta;
        r.overlapped = handleBounds.contains(this.mouseHandler.previousMouse.position);
        if (this.mouseHandler.currentMouse.pressed && r.overlapped)
            r.dragged = true;
        if (r.id == this.lastTranslateHandleID && this.mouseHandler.currentMouse.pressed) {
            r.dragged = true;
            r.overlapped = true;
        }
        if (r.dragged) {
            this.anyDragged = true;
            this.lastTranslateHandleID = r.id;
        }
        if (r.overlapped)
            this.renderTarget.drawRectangle(handleBounds, "yellow");
        this.renderTarget.drawWireRectangle(handleBounds, "orange");
        return r;
    }
    adjustRect(rect, isSelected) {
        let r = new TransientRect(rect, this);
        this.transientRects.push(r);
        if (isSelected) {
            this.renderTarget.drawWireRectangle(rect, "#69b969");
            this.translateHandle(new Point(rect.x + (rect.width / 2), rect.y)).ifDragged(() => {
                rect.y += this.mouseHandler.mouseDelta.y;
                rect.height -= this.mouseHandler.mouseDelta.y;
            });
            this.translateHandle(new Point(rect.x + (rect.width / 2), rect.y + rect.height)).ifDragged(() => {
                rect.height += this.mouseHandler.mouseDelta.y;
            });
            this.translateHandle(new Point(rect.x, rect.y + (rect.height / 2))).ifDragged(() => {
                rect.x += this.mouseHandler.mouseDelta.x;
                rect.width -= this.mouseHandler.mouseDelta.x;
            });
            this.translateHandle(new Point(rect.x + rect.width, rect.y + (rect.height / 2))).ifDragged(() => {
                rect.width += this.mouseHandler.mouseDelta.x;
            });
        }
        else
            this.renderTarget.drawWireRectangle(rect, "#494949");
        return r;
    }
}
//# sourceMappingURL=EditorContext.js.map