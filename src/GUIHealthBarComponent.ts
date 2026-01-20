import { Component, componentType} from "./Component.js";
import { RenderComponent } from "./RenderModule.js";
import { HealthComponent } from "./HealthComponent.js";
import { Engine } from "./Engine.js";
import { RenderLayers } from "./RenderLayers.js";
import { RenderContext } from "./RenderContext.js";
import { Point } from "./Point.js";

type GUIHealthBarPrototype = {
  maxHealth: number;
}

@componentType("GUIHealthBar")
export class GUIHealthBarComponent extends RenderComponent {
  private health: HealthComponent | undefined = undefined;

  public awake(engine: Engine) {
    this.health = this.parent?.getComponent(HealthComponent);
    this.renderLayer = RenderLayers.GUI;
  }

  public render(context: RenderContext):void { 
    if (this.health) {
      let target = context.getTarget(RenderLayers.GUI);
      target.drawString(`${this.health.currentHealth}/${this.health.maxHealth}`, new Point(5, 20), "black");
    }
  }
}