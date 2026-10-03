var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { AssetStore } from "./AssetStore.js";
import { RenderContext } from "./RenderContext.js";
import { RenderComponent } from "./RenderModule.js";
import { componentType } from "./Component.js";
import { AssetReference } from "./AssetReference.js";
import { Mesh } from "./gl/Mesh.js";
import { Material } from "./gl/Material.js";
let MeshComponent = class MeshComponent extends RenderComponent {
    mesh = null;
    material = null;
    constructor(prototype) {
        super(prototype);
    }
    resolveDependencies(reference, engine) {
    }
    render(context) {
    }
};
MeshComponent = __decorate([
    componentType("Mesh"),
    __metadata("design:paramtypes", [Object])
], MeshComponent);
export { MeshComponent };
//# sourceMappingURL=MeshComponent.js.map