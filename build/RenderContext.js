import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { Camera } from "./Camera.js";
import { RawImage } from "./RawImage.js";
import { RenderTarget } from "./RenderTarget.js";
import { RenderLayers, RenderChannels } from "./RenderLayers.js";
export class RenderContext {
    renderTargets;
    constructor(width, height) {
        this.renderTargets = {
            [RenderLayers.Background]: {
                [RenderChannels.Diffuse]: new RenderTarget(width, height),
                [RenderChannels.Normals]: new RenderTarget(width, height),
                [RenderChannels.Collision]: new RenderTarget(width, height)
            },
            [RenderLayers.Objects]: {
                [RenderChannels.Diffuse]: new RenderTarget(width, height),
                [RenderChannels.Normals]: new RenderTarget(width, height),
                [RenderChannels.Collision]: new RenderTarget(width, height)
            }
        };
    }
    getTarget(layer, channel) {
        return this.renderTargets[layer][channel];
    }
    prepAll() {
        this.renderTargets[RenderLayers.Background][RenderChannels.Diffuse].reset();
        this.renderTargets[RenderLayers.Background][RenderChannels.Normals].reset();
        this.renderTargets[RenderLayers.Background][RenderChannels.Collision].reset();
        this.renderTargets[RenderLayers.Objects][RenderChannels.Diffuse].reset();
        this.renderTargets[RenderLayers.Objects][RenderChannels.Normals].reset();
    }
    flushAll(cam) {
        this.renderTargets[RenderLayers.Background][RenderChannels.Diffuse].flush(cam);
        this.renderTargets[RenderLayers.Background][RenderChannels.Normals].flush(cam);
        this.renderTargets[RenderLayers.Background][RenderChannels.Collision].flush(cam);
        this.renderTargets[RenderLayers.Objects][RenderChannels.Diffuse].flush(cam);
        this.renderTargets[RenderLayers.Objects][RenderChannels.Normals].flush(cam);
    }
}
//# sourceMappingURL=RenderContext.js.map