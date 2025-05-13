import { Component } from "./Component.js";
import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Module } from "./Module.js";

export class RenderComponent extends Component {
  public render(context: RenderingContext) {}
}

export class RenderingContext {
  public canvas: HTMLCanvasElement;
  public context: CanvasRenderingContext2D;

  public DrawSprite(sprite: Sprite, position: Point) {
    this.context.drawImage(
      sprite.asset.asset, 
      sprite.sourceRect.x,
      sprite.sourceRect.y,
      sprite.sourceRect.width,
      sprite.sourceRect.height,
      position.x,
      position.y,
      sprite.sourceRect.width,
      sprite.sourceRect.height);
  }
}

export class RenderModule extends Module {
  private renderables: RenderComponent[] = [];

  ComponentCreated(component: Component) {
    if (component instanceof RenderComponent) {
      this.renderables.push(component as RenderComponent);
    }
  }

  Update() {
  }

  Render(context: RenderingContext) {
    for (var renderable of this.renderables)
      renderable.render(context);
  }
}