import { Point } from "./../Point.js";
import { RenderTarget2D } from "./../RenderTarget2D.js";
import { Camera } from "./../Camera.js";
import { MouseHandler } from "./../MouseHandler.js";
import { Rect } from "./../Rect.js";
import { Fluent } from "../Fluent.js";

export class HandleProperties {
  public color: string = "orange";
  public hoverColor: string = "yellow";

  public constructor(color?: string, hoverColor? : string) {
    this.color = color ?? "orange";
    this.hoverColor = hoverColor ?? "yellow";
  }
}

type transientHandleCallback = (handle: TransientHandle) => void;

export class TransientHandle {
  public id: number = 0;
  public dragged: boolean = false;
  public clicked: boolean = false;
  public overlapped: boolean = false;
  public delta: Point = new Point(0,0);
  public mousePosition: Point = new Point(0,0);
  public ifDragged(callback: transientHandleCallback) : TransientHandle {
    if (this.dragged) callback(this);
    return this;
  }

  private ifReleasedCallback: transientHandleCallback | null = null;
  public ifReleased(callback: transientHandleCallback) : TransientHandle {
    this.ifReleasedCallback = callback;
    return this;
  }
  public triggerIfReleased() {
    if (this.ifReleasedCallback != null) this.ifReleasedCallback(this);
  }
}

type transientRectCallback = (rect: TransientRect) => void;

export class TransientRect {
  public rect: Rect;
  public editorContext: EditorContext;

  constructor(rect: Rect, editorContext: EditorContext) {
    this.rect = rect;
    this.editorContext = editorContext;
  }

  private ifClickedCallback: transientRectCallback | null = null;
  public ifClicked(callback: transientRectCallback) {
    this.ifClickedCallback = callback;
  }
  public triggerIfClicked() {
    if (this.ifClickedCallback != null) this.ifClickedCallback(this);
  }
}

type transientButtonCallback = (button: TransientButton) => void;

export class TransientButton { 
  public rect: Rect;
  constructor(rect: Rect) {
    this.rect = rect;
  }

  private ifClickedCallback: transientButtonCallback | null = null;
  public ifClicked(callback: transientButtonCallback) {
    this.ifClickedCallback = callback;
  }
  public triggerIfClicked() {
    if (this.ifClickedCallback != null) this.ifClickedCallback(this);
  }
}  

export class EditorContext {
  public mouseHandler: MouseHandler;
  public renderTarget: RenderTarget2D;
  public camera: Camera;
  public handleSize: number = 10;
  public fluent: Fluent = new Fluent();

  private transientRects: (TransientRect | TransientButton)[] = [];

  constructor(camera: Camera, renderTarget: RenderTarget2D) {
    this.renderTarget = renderTarget;
    this.camera = camera;
    this.mouseHandler = new MouseHandler(renderTarget.canvas, camera);
  }

  private lastTranslateHandleID: number = 0;
  private nextTranslateHandleID: number = 1;
  private anyDragged: boolean = false;
  private previouslyDragged: TransientHandle | null = null;

  public open() {
    this.anyDragged = false;
    this.nextTranslateHandleID = 1;
  }

  public close() {
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
  
  public allocateHandleId() {
    let r = this.nextTranslateHandleID;
    this.nextTranslateHandleID += 1;
    return r;
  }

  public translateHandle(handleBounds: Rect, properties: HandleProperties) : TransientHandle {
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

  public adjustRect(rect: Rect, isSelected: boolean) : TransientRect {
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

  public button(rect: Rect) : TransientButton {
    let r = new TransientButton(rect);
    this.transientRects.push(r);
    this.renderTarget.drawRectangle(rect, "green");
    return r;
  }
  
}