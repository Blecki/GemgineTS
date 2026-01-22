import { Entity } from "./Entity.js";
import { AssetStore } from "./AssetStore.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { ComponentFactory } from "./ComponentFactory.js";
import { AssetReference } from "./AssetReference.js";
import { Modules } from "./Modules.js";
export function componentType(name) {
    return function (ctr) {
        ComponentFactory.addComponentType(name, ctr);
    };
}
export class Component {
    parent = null;
    constructor(prototype) { }
    initialize(engine, template, prototypeAsset) { }
    awake(engine, modules) { }
}
//# sourceMappingURL=Component.js.map