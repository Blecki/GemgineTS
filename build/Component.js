import { Entity } from "./Entity.js";
import { Engine } from "./Engine.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { ComponentFactory } from "./ComponentFactory.js";
import { AssetReference } from "./AssetReference.js";
export function componentType(name) {
    return function (ctr) {
        ComponentFactory.addComponentType(name, ctr);
    };
}
export class Component {
    parent = null;
    constructor(prototype) { }
    initialize(engine, template, prototypeAsset) { }
    awake(engine) { }
}
//# sourceMappingURL=Component.js.map