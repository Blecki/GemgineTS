var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
import { Component, componentType } from "./Component.js";
import { Module } from "./Module.js";
import { GameTime } from "./GameTime.js";
import { RenderLayers } from "./RenderLayers.js";
export class RenderComponent extends Component {
    renderLayer;
    render(context) { }
}
let DebugGizmoComponent = (() => {
    let _classDecorators = [componentType("DebugGizmo")];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _classSuper = RenderComponent;
    var DebugGizmoComponent = class extends _classSuper {
        static { _classThis = this; }
        static {
            const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(_classSuper[Symbol.metadata] ?? null) : void 0;
            __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
            DebugGizmoComponent = _classThis = _classDescriptor.value;
            if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
            __runInitializers(_classThis, _classExtraInitializers);
        }
        render(context) {
            context.context.globalAlpha = 0.5;
            context.context.globalCompositeOperation = "source-over";
            context.drawRectangle(this.parent.globalBounds, 'red');
        }
    };
    return DebugGizmoComponent = _classThis;
})();
export { DebugGizmoComponent };
export class RenderModule extends Module {
    renderables = [];
    camera;
    fpsQueue;
    isRenderable(object) {
        return 'render' in object;
    }
    constructor() {
        super();
        this.fpsQueue = [];
    }
    entityCreated(entity) {
        entity.components.forEach(component => {
            if (this.isRenderable(component)) {
                this.renderables.push(component);
            }
        });
    }
    render(engine, context) {
        context.context.globalAlpha = 1;
        context.context.globalCompositeOperation = 'source-over';
        for (let layer in RenderLayers) {
            let layerNum = Number(RenderLayers[layer]);
            if (!Number.isNaN(layerNum)) {
                for (let renderable of this.renderables) {
                    if (renderable.renderLayer == layerNum)
                        renderable.render(context);
                }
                context.flush(this.camera);
            }
        }
        this.fpsQueue.push(GameTime.getDeltaTime());
        if (this.fpsQueue.length > 200)
            this.fpsQueue.shift();
        let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
        context.context.fillStyle = 'black';
        context.context.textAlign = 'left';
        context.context.textBaseline = 'top';
        context.context.fillText(Math.round(1 / averageFrameTime).toString(), 5, 5);
    }
    setCamera(camera) {
        this.camera = camera;
    }
}
//# sourceMappingURL=RenderModule.js.map