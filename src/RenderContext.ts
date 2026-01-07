import { Sprite } from "./Sprite.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { Camera } from "./Camera.js";
import { RawImage } from "./RawImage.js";
import { RenderTarget } from "./RenderTarget.js";
import { RenderLayers, RenderChannels } from "./RenderLayers.js"

type DrawTask = (context: CanvasRenderingContext2D, camera: Camera) => void;
type TargetDirectory = Record<RenderLayers, Record<RenderChannels, RenderTarget>>;

export class RenderContext {
  private renderTargets: TargetDirectory;

  constructor(width: number, height: number, gl: WebGL2RenderingContext) {
    this.renderTargets = {
      [RenderLayers.Background]: {
        [RenderChannels.Diffuse]: new RenderTarget(width, height, gl),
        [RenderChannels.Normals]: new RenderTarget(width, height, gl),
        [RenderChannels.Collision]: new RenderTarget(width, height, gl)
      },
      [RenderLayers.Objects]: {
        [RenderChannels.Diffuse]: new RenderTarget(width, height, gl),
        [RenderChannels.Normals]: new RenderTarget(width, height, gl),
        [RenderChannels.Collision]: new RenderTarget(width, height, gl)
      }
    };
  }

  public getTarget(layer: RenderLayers, channel: RenderChannels): RenderTarget {
    return this.renderTargets[layer][channel];
  }

  public prepAll() {
    this.renderTargets[RenderLayers.Background][RenderChannels.Diffuse].reset();
    this.renderTargets[RenderLayers.Background][RenderChannels.Normals].reset();
    this.renderTargets[RenderLayers.Background][RenderChannels.Collision].reset();
    this.renderTargets[RenderLayers.Objects][RenderChannels.Diffuse].reset();
    this.renderTargets[RenderLayers.Objects][RenderChannels.Normals].reset();
  }

  
  public flushAll(cam: Camera) {
    this.renderTargets[RenderLayers.Background][RenderChannels.Diffuse].flush(cam);
    this.renderTargets[RenderLayers.Background][RenderChannels.Normals].flush(cam);
    this.renderTargets[RenderLayers.Background][RenderChannels.Collision].flush(cam);
    this.renderTargets[RenderLayers.Objects][RenderChannels.Diffuse].flush(cam);
    this.renderTargets[RenderLayers.Objects][RenderChannels.Normals].flush(cam);
  }
}
