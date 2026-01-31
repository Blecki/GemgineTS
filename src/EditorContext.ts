import { Point } from "./Point.js";
import { RenderTarget } from "./RenderTarget.js";
import { Camera } from "./Camera.js";
import { MouseHandler } from "./MouseHandler.js";
import { Rect } from "./Rect.js";


type transientHandleCallback = () => void;


export class TransientHandle {
  public id: number = 0;
  public dragged: boolean = false;
  public clicked: boolean = false;
  public overlapped: boolean = false;
  public delta: Point = new Point(0,0);
  public ifDragged(callback: transientHandleCallback) {
    if (this.dragged) callback();
  }
}

export class TransientRect {
  public rect: Rect;
  public editorContext: EditorContext;

  constructor(rect: Rect, editorContext: EditorContext) {
    this.rect = rect;
    this.editorContext = editorContext;
  }

  private ifClickedCallback: transientHandleCallback | null = null;
  public ifClicked(callback: transientHandleCallback) {
    this.ifClickedCallback = callback;
  }
  public triggerIfClicked() {
    if (this.ifClickedCallback != null) this.ifClickedCallback();
  }
}

export class EditorContext {
  public mouseHandler: MouseHandler;
  public renderTarget: RenderTarget;
  public camera: Camera;
  public handleSize: number = 10;

  private transientRects: TransientRect[] = [];

  constructor(camera: Camera, renderTarget: RenderTarget) {
    this.renderTarget = renderTarget;
    this.camera = camera;
    this.mouseHandler = new MouseHandler(renderTarget.canvas, camera);
  }

  private lastTranslateHandleID: number = 0;
  private nextTranslateHandleID: number = 1;
  private anyDragged: boolean = false;

  public open() {
    this.anyDragged = false;
    this.nextTranslateHandleID = 1;
  }

  public close() {


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

  public translateHandle(position: Point) : TransientHandle {
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

  public adjustRect(rect: Rect, isSelected: boolean) : TransientRect {
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