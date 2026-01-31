import type { Camera } from "./Camera.js";
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
  private camera: Camera;

  constructor(element: HTMLCanvasElement, camera: Camera) {
    this.camera = camera;

    element.addEventListener('mousedown', (e) => {
      const rect: DOMRect = element.getBoundingClientRect();
      this.currentMouse.pressed = e.buttons == 1;
      this.currentMouse.position = this.camera.screenToWorld(new Point(e.offsetX, e.offsetY));
    });

    element.addEventListener('mousemove', (e) => {
      const rect: DOMRect = element.getBoundingClientRect();
      this.currentMouse.pressed = e.buttons == 1;
      this.currentMouse.position = this.camera.screenToWorld(new Point(e.offsetX, e.offsetY));
    });

    element.addEventListener('mouseup', (e) => {
      const rect: DOMRect = element.getBoundingClientRect();
      this.currentMouse.pressed = false;
      this.currentMouse.position = this.camera.screenToWorld(new Point(e.offsetX, e.offsetY));
    });
  }

  public update() : void {
    this.mouseDelta = this.currentMouse.position.sub(this.previousMouse.position);
    this.previousMouse = this.currentMouse.clone();
  }
}