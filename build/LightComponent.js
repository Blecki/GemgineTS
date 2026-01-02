var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Color } from "./Color.js";
import { Component, componentType } from "./Component.js";
import { Point } from "./Point.js";
let LightComponent = class LightComponent extends Component {
    offset;
    radius;
    color;
    intensity;
    constructor(prototype) {
        super(prototype);
        let p = prototype;
        this.offset = new Point(p?.offset);
        this.radius = p?.radius ?? 1;
        this.color = new Color(p?.color);
        this.intensity = p?.intensity ?? 1;
    }
};
LightComponent = __decorate([
    componentType("Light"),
    __metadata("design:paramtypes", [Object])
], LightComponent);
export { LightComponent };
//# sourceMappingURL=LightComponent.js.map