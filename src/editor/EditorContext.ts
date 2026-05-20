import { Point } from "./../Point.js";
import { RenderTarget2D } from "./../RenderTarget2D.js";
import { Camera } from "./../Camera.js";
import { MouseHandler } from "./../MouseHandler.js";
import { Rect } from "./../Rect.js";
import { Fluent } from "../Fluent.js";
import { KeyboardHandler, type KeyState } from "../KeyboardHandler.js";
import { AssetStore } from "../AssetStore.js";

export class HandleProperties {
  public color: string = "orange";
  public hoverColor: string = "yellow";

  public constructor(color?: string, hoverColor? : string) {
    this.color = color ?? "orange";
    this.hoverColor = hoverColor ?? "yellow";
  }
}

export class InputEvent {
  public triggered: boolean = false;
  public mousePosition: Point = new Point(0,0);
  public mouseDelta: Point = new Point(0,0);
  public handled: boolean = false;
  public altHeld: boolean = false;
}

type transientWidgetCallback = (event: InputEvent) => void;

export class InputHandlerEvent {
  public inputEvent: InputEvent;
  public callback: transientWidgetCallback;
  public checkHandled: boolean;

  constructor(inputEvent: InputEvent, callback: transientWidgetCallback, checkHandled: boolean) {
    this.inputEvent = inputEvent;
    this.callback = callback;
    this.checkHandled = checkHandled;
  }

  public trigger() {
    if (this.checkHandled && this.inputEvent.handled)
      return;
    this.callback(this.inputEvent);
  }
}

export class TransientWidget {
  public id: number = 0;
  public hasFocus: boolean = false;
  public overlapped: boolean = false;
  public keys: KeyState[] = [];
  public context: EditorContext;

  constructor(context: EditorContext) {
    this.context = context;
  }

  public ifMouseDown(callback: transientWidgetCallback) : TransientWidget {
    if (this.context.mouseDown?.triggered && this.overlapped) {
      this.context.enqueuInputHandlerEvent(new InputHandlerEvent(this.context.mouseDown, callback, true));
    }
    return this;
  }

  public ifMouseUp(callback: transientWidgetCallback) : TransientWidget {
    if (this.context.mouseUp?.triggered) {
      this.context.enqueuInputHandlerEvent(new InputHandlerEvent(this.context.mouseUp, callback, false));
    }
    return this;
  }

  public ifDragged(callback: transientWidgetCallback) : TransientWidget {
    if (this.context.mouseDrag?.triggered && this.id == this.context.dragItem) {
      this.context.enqueuInputHandlerEvent(new InputHandlerEvent(this.context.mouseDrag, callback, true));
    }
    return this;
  }

  public ifKey(callback: (w: TransientWidget, key: KeyState) => void) : TransientWidget {
    this.keys.forEach(k => callback(this, k));
    return this;
  }
}

class WidgetProperties {
  public fill: string = "#ffffff";
  public border: string = "#444444";
  public border_focus: string = "#ff0000";
  public text: string = "";
  public text_color: string = "#000000";
  public image: ImageBitmap | null = null;
  public radius: number = 0;
}

var widgetProperties : WidgetProperties = new WidgetProperties();

export class EditorContext {
  public mouseHandler: MouseHandler;
  public keyboardHandler: KeyboardHandler;
  public renderTarget: RenderTarget2D;
  public fluent: Fluent = new Fluent();
  public focusItem: number = -1;
  public dragItem: number = -1;
  public assetStore: AssetStore;
  private digitReg: RegExp = /^\d$/;
  public mouseDown: InputEvent = new InputEvent();
  public mouseUp: InputEvent = new InputEvent();
  public mouseDrag: InputEvent = new InputEvent();
  private inputHandlerTriggers: InputHandlerEvent[] = [];

  constructor(camera: Camera, renderTarget: RenderTarget2D, assetStore: AssetStore) {
    this.renderTarget = renderTarget;
    this.mouseHandler = new MouseHandler(renderTarget.canvas, camera);
    this.keyboardHandler = new KeyboardHandler(renderTarget.canvas);
    this.assetStore = assetStore;
    renderTarget.canvas.tabIndex = 1;
  }

  private nextTranslateHandleID: number = 1;

  public enqueuInputHandlerEvent(handler: InputHandlerEvent) {
    this.inputHandlerTriggers.push(handler);
  }

  public open() {
    this.nextTranslateHandleID = 1;

    this.mouseDown.triggered = !this.mouseHandler.previousMouse.pressed && this.mouseHandler.currentMouse.pressed;
    this.mouseDown.mouseDelta = this.mouseHandler.mouseDelta;
    this.mouseDown.mousePosition = this.mouseHandler.previousMouse.position;
    this.mouseDown.handled = false;
    this.mouseDown.altHeld = this.keyboardHandler.isKeyDown("AltLeft");
    
    this.mouseUp.triggered = (this.mouseHandler.previousMouse.pressed && !this.mouseHandler.currentMouse.pressed);
    this.mouseUp.mouseDelta = this.mouseHandler.mouseDelta;
    this.mouseUp.mousePosition = this.mouseHandler.previousMouse.position;
    this.mouseUp.handled = false;
    this.mouseUp.altHeld = this.keyboardHandler.isKeyDown("AltLeft");

    this.mouseDrag.triggered = (this.mouseHandler.currentMouse.pressed || this.mouseUp.triggered);
    this.mouseDrag.mouseDelta = this.mouseHandler.mouseDelta;
    this.mouseDrag.mousePosition = this.mouseHandler.previousMouse.position;
    this.mouseDrag.handled = false;
    this.mouseDrag.altHeld = this.keyboardHandler.isKeyDown("AltLeft");
  }

  public close() {

    for (let x = 0; x < this.inputHandlerTriggers.length; ++x)
      this.inputHandlerTriggers[x].trigger();
    this.inputHandlerTriggers = [];
    this.mouseHandler.update();
    if (!this.mouseHandler.currentMouse.pressed) this.dragItem = -1;
  }
  
  public allocateHandleId() {
    let r = this.nextTranslateHandleID;
    this.nextTranslateHandleID += 1;
    return r;
  }

  public focus(id: number) {
    this.focusItem = id;
  }

  public translateHandle(handleBounds: Rect, properties: HandleProperties) : TransientWidget {
    let r = this.widget(handleBounds)
    if (r.overlapped)
      this.renderTarget.drawWireRectangle(handleBounds, properties.hoverColor);
    else
      this.renderTarget.drawWireRectangle(handleBounds, properties.color);
    return r;
  }

  public adjustRect(rect: Rect, isSelected: boolean) : TransientWidget {
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
    
    return this.widget(rect);
  }

  public widget(rect: Rect, properties?: object) : TransientWidget {
    if (properties == undefined) properties = new WidgetProperties();
    else properties = Object.assign({}, widgetProperties, properties);
    let props = properties as WidgetProperties;

    let r = new TransientWidget(this);
    r.id = this.allocateHandleId();
    r.hasFocus = r.id == this.focusItem;
    r.overlapped = rect.contains(this.mouseHandler.previousMouse.position);
    if (this.dragItem == -1 && r.overlapped && this.mouseHandler.currentMouse.pressed)
      this.dragItem = r.id;
    if (r.hasFocus) r.keys = this.keyboardHandler.consumeEvents();

    let drect = rect.withOffset(new Point(0,0));
    this.renderTarget.drawCustom((context) => {
      context.beginPath();
      if (props.radius != 0) context.roundRect(drect.x, drect.y, drect.width, drect.height, props.radius);
      else context.rect(drect.x, drect.y, drect.width, drect.height);
      context.closePath();
      if (props.fill != "") {
        context.fillStyle = props.fill;
        context.fill();
      }
      if (props.border != "") {
        context.strokeStyle = props.border;
        context.stroke();
      }
      if (props.border_focus != "" && r.hasFocus) {
        context.strokeStyle = props.border_focus;
        context.stroke();
      }
    });
    if (props.text != "") this.renderTarget.drawString(props.text, rect.origin.add(new Point(4, 2)), props.text_color);
    if (props.image != null) this.renderTarget.drawImage(props.image, new Rect(0, 0, props.image.width, props.image.height), rect.origin);

    return r;
  }

  public field(rect: Rect, value: string) : string {
    let widget = this.widget(rect, {text: value});

    widget.ifMouseDown(w => {
      this.focus(widget.id);
      w.handled = true;
    });

    widget.ifKey((w, k) => {
      if (k.code == 'Backspace') {
        if (value.length > 0) value = value.substring(0, value.length - 1);
      }
      else if (k.key.length == 1)
        value += k.key;
    });

    return value;
  }

  public numberField(rect: Rect, value: string) : string {
    let widget = this.widget(rect, {text: value});

    widget.ifMouseDown(w => {
      this.focus(widget.id);
      w.handled = true;
    });

    widget.ifKey((w, k) => {
      if (k.code == 'Backspace') {
        if (value.length > 0) value = value.substring(0, value.length - 1);
        if (value.length == 0) value = '0';
      }
      else if (k.key.length == 1 && this.digitReg.test(k.key))
        value += k.key;
    });

    return value;
  }
}