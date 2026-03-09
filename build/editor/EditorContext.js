import { Point } from "./../Point.js";
import { RenderTarget2D } from "./../RenderTarget2D.js";
import { Camera } from "./../Camera.js";
import { MouseHandler } from "./../MouseHandler.js";
import { Rect } from "./../Rect.js";
import { Fluent } from "../Fluent.js";
export class HandleProperties {
    color = "orange";
    hoverColor = "yellow";
    constructor(color, hoverColor) {
        this.color = color ?? "orange";
        this.hoverColor = hoverColor ?? "yellow";
    }
}
export class TransientHandle {
    id = 0;
    dragged = false;
    clicked = false;
    overlapped = false;
    delta = new Point(0, 0);
    mousePosition = new Point(0, 0);
    ifDragged(callback) {
        if (this.dragged)
            callback(this);
        return this;
    }
    ifReleasedCallback = null;
    ifReleased(callback) {
        this.ifReleasedCallback = callback;
        return this;
    }
    triggerIfReleased() {
        if (this.ifReleasedCallback != null)
            this.ifReleasedCallback(this);
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
            this.ifClickedCallback(this);
    }
}
export class TransientButton {
    rect;
    constructor(rect) {
        this.rect = rect;
    }
    ifClickedCallback = null;
    ifClicked(callback) {
        this.ifClickedCallback = callback;
    }
    triggerIfClicked() {
        if (this.ifClickedCallback != null)
            this.ifClickedCallback(this);
    }
}
export class EditorContext {
    mouseHandler;
    renderTarget;
    camera;
    handleSize = 10;
    fluent = new Fluent();
    transientRects = [];
    constructor(camera, renderTarget) {
        this.renderTarget = renderTarget;
        this.camera = camera;
        this.mouseHandler = new MouseHandler(renderTarget.canvas, camera);
    }
    lastTranslateHandleID = 0;
    nextTranslateHandleID = 1;
    anyDragged = false;
    previouslyDragged = null;
    open() {
        this.anyDragged = false;
        this.nextTranslateHandleID = 1;
    }
    close() {
        if (this.anyDragged == false) {
            if (this.previouslyDragged) {
                this.previouslyDragged.triggerIfReleased();
                this.previouslyDragged = null;
            }
            this.lastTranslateHandleID = 0;
            // User didn't drag with any handles so check for mouse click
            if (this.mouseHandler.previousMouse.pressed == false && this.mouseHandler.currentMouse.pressed == true) {
                let mouseWorldPoint = this.mouseHandler.currentMouse.position;
                console.log(mouseWorldPoint);
                console.log(this.transientRects);
                let clickedGizmos = this.transientRects.filter(g => g.rect.contains(mouseWorldPoint));
                if (clickedGizmos.length > 0)
                    clickedGizmos[clickedGizmos.length - 1].triggerIfClicked();
            }
        }
        this.transientRects = [];
        this.mouseHandler.update();
    }
    allocateHandleId() {
        let r = this.nextTranslateHandleID;
        this.nextTranslateHandleID += 1;
        return r;
    }
    translateHandle(handleBounds, properties) {
        let r = new TransientHandle();
        r.id = this.allocateHandleId();
        r.delta = this.mouseHandler.mouseDelta;
        r.overlapped = handleBounds.contains(this.mouseHandler.previousMouse.position);
        r.mousePosition = this.mouseHandler.previousMouse.position;
        if (this.mouseHandler.currentMouse.pressed && r.overlapped && this.lastTranslateHandleID == 0)
            r.dragged = true;
        if (r.id == this.lastTranslateHandleID && this.mouseHandler.currentMouse.pressed) {
            r.dragged = true;
            r.overlapped = true;
        }
        if (r.dragged) {
            this.anyDragged = true;
            this.previouslyDragged = r;
            this.lastTranslateHandleID = r.id;
        }
        if (r.overlapped)
            this.renderTarget.drawWireRectangle(handleBounds, properties.hoverColor);
        else
            this.renderTarget.drawWireRectangle(handleBounds, properties.color);
        return r;
    }
    adjustRect(rect, isSelected) {
        let r = new TransientRect(rect, this);
        this.transientRects.push(r);
        if (isSelected) {
            this.renderTarget.drawWireRectangle(rect, "#69b969");
            this.translateHandle(new Rect(rect.x + (rect.width / 2) - 5, rect.y - 5, 10, 10), new HandleProperties()).ifDragged(() => {
                rect.y += this.mouseHandler.mouseDelta.y;
                rect.height -= this.mouseHandler.mouseDelta.y;
            });
            this.translateHandle(new Rect(rect.x + (rect.width / 2) - 5, rect.y + rect.height - 5, 10, 10), new HandleProperties()).ifDragged(() => {
                rect.height += this.mouseHandler.mouseDelta.y;
            });
            this.translateHandle(new Rect(rect.x - 5, rect.y + (rect.height / 2) - 5, 10, 10), new HandleProperties()).ifDragged(() => {
                rect.x += this.mouseHandler.mouseDelta.x;
                rect.width -= this.mouseHandler.mouseDelta.x;
            });
            this.translateHandle(new Rect(rect.x + rect.width - 5, rect.y + (rect.height / 2) - 5, 10, 10), new HandleProperties()).ifDragged(() => {
                rect.width += this.mouseHandler.mouseDelta.x;
            });
        }
        else
            this.renderTarget.drawWireRectangle(rect, "#494949");
        return r;
    }
    button(rect) {
        let r = new TransientButton(rect);
        this.transientRects.push(r);
        this.renderTarget.drawRectangle(rect, "green");
        return r;
    }
}
//# sourceMappingURL=EditorContext.js.map