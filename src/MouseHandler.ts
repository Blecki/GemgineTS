import { type FluentElement } from "./Fluent.js";
import { Point } from "./Point.js";

export class MouseState {
  public position: Point = new Point(0,0);
  public pressed: boolean = false;

  public clone(): MouseState {
    let r = new MouseState();
    r.pressed = this.pressed;
    r.position = this.position;
    return r;
  }
}

export class MouseHandler {
  public previousMouse : MouseState = new MouseState();
  public currentMouse : MouseState = new MouseState();
  public mouseDelta : Point = new Point(0,0);

  constructor(element: FluentElement) {
    element._handler('mousedown', (e) => {
      const rect: DOMRect = element.getBoundingClientRect();
      this.currentMouse.pressed = e.buttons == 1;
      this.currentMouse.position = new Point(e.clientX - rect.left, e.clientY - rect.top);
    });

    element._handler('mousemove', (e) => {
      const rect: DOMRect = element.getBoundingClientRect();
      this.currentMouse.pressed = e.buttons == 1;
      this.currentMouse.position = new Point(e.clientX - rect.left, e.clientY - rect.top);
    });

    element._handler('mouseup', (e) => {
      const rect: DOMRect = element.getBoundingClientRect();
      this.currentMouse.pressed = false;
      this.currentMouse.position = new Point(e.clientX - rect.left, e.clientY - rect.top);
    });
  }

  public update() : void {
    this.mouseDelta = this.currentMouse.position.sub(this.previousMouse.position);
    this.previousMouse = this.currentMouse.clone();
  }
}