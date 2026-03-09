import { Camera } from "./Camera.js";
import { RenderTarget2D } from "./RenderTarget2D.js";
import { RenderLayers } from "./RenderLayers.js";
export class RenderContext {
    renderTargets;
    constructor(width, height, gl) {
        this.renderTargets = {
            [RenderLayers.BackgroundDiffuse]: new RenderTarget2D(width, height, gl),
            [RenderLayers.ObjectsDiffuse]: new RenderTarget2D(width, height, gl),
            [RenderLayers.Collision]: new RenderTarget2D(width, height, gl),
            [RenderLayers.GUI]: new RenderTarget2D(width, height, gl)
        };
    }
    getTarget(layer) {
        return this.renderTargets[layer];
    }
    prepAll() {
        this.renderTargets[RenderLayers.BackgroundDiffuse].reset();
        this.renderTargets[RenderLayers.ObjectsDiffuse].reset();
        this.renderTargets[RenderLayers.Collision].reset();
        this.renderTargets[RenderLayers.GUI].reset();
    }
    flushAll(worldCamera, guiCamera) {
        this.renderTargets[RenderLayers.BackgroundDiffuse].flush(worldCamera);
        this.renderTargets[RenderLayers.ObjectsDiffuse].flush(worldCamera);
        this.renderTargets[RenderLayers.Collision].flush(worldCamera);
        this.renderTargets[RenderLayers.GUI].flush(guiCamera);
    }
}
//# sourceMappingURL=RenderContext.js.map