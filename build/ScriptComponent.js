var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component } from "./Component.js";
import { componentType } from "./Component.js";
import { Fluent } from "./Fluent.js";
import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import { Entity } from "./Entity.js";
export function loadScript(basePath, path) {
    return new Promise(async (resolve, reject) => {
        const module = await import(basePath + path);
        resolve(new AssetReference(path, module));
    });
}
let ScriptComponent = class ScriptComponent extends Component {
    scriptPath;
    scriptAsset = null;
    scriptObject = null;
    constructor(prototype) {
        super(prototype);
        let p = prototype;
        this.scriptPath = p?.scriptPath ?? "";
    }
    resolveDependencies(reference, assets) {
        this.scriptAsset = assets.getPreloadedAsset(this.scriptPath).asset;
    }
};
ScriptComponent = __decorate([
    componentType("Script"),
    __metadata("design:paramtypes", [Object])
], ScriptComponent);
export { ScriptComponent };
//# sourceMappingURL=ScriptComponent.js.map