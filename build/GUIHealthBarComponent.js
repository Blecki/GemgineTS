var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { componentType } from "./Component.js";
import { RenderComponent } from "./RenderModule.js";
import { HealthComponent } from "./HealthComponent.js";
import { AssetStore } from "./AssetStore.js";
import { RenderLayers } from "./RenderLayers.js";
import { RenderContext } from "./RenderContext.js";
import { Point } from "./Point.js";
let GUIHealthBarComponent = class GUIHealthBarComponent extends RenderComponent {
    health = undefined;
    awake(engine) {
        this.health = this.parent?.getComponent(HealthComponent);
        this.renderLayer = RenderLayers.GUI;
    }
    render(context) {
        if (this.health) {
            let target = context.getTarget(RenderLayers.GUI);
            target.drawString(`${this.health.currentHealth}/${this.health.maxHealth}`, new Point(5, 20), "black");
        }
    }
};
GUIHealthBarComponent = __decorate([
    componentType("GUIHealthBar")
], GUIHealthBarComponent);
export { GUIHealthBarComponent };
//# sourceMappingURL=GUIHealthBarComponent.js.map