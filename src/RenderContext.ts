import { Camera } from "./Camera.js";
import { RenderTarget } from "./RenderTarget.js";
import { RenderLayers } from "./RenderLayers.js"

type DrawTask = (context: CanvasRenderingContext2D, camera: Camera) => void;
type TargetDirectory = Record<RenderLayers, RenderTarget>;

export class RenderContext {
  private renderTargets: TargetDirectory;

  constructor(width: number, height: number, gl: WebGL2RenderingContext) {
    this.renderTargets = {
      [RenderLayers.BackgroundDiffuse]: new RenderTarget(width, height, gl),
      [RenderLayers.ObjectsDiffuse]: new RenderTarget(width, height, gl),
      [RenderLayers.Collision]: new RenderTarget(width, height, gl),
      [RenderLayers.GUI]: new RenderTarget(width, height, gl)
    };
  }

  public getTarget(layer: RenderLayers): RenderTarget {
    return this.renderTargets[layer];
  }

  public prepAll() {
    this.renderTargets[RenderLayers.BackgroundDiffuse].reset();
    this.renderTargets[RenderLayers.ObjectsDiffuse].reset();
    this.renderTargets[RenderLayers.Collision].reset();
    this.renderTargets[RenderLayers.GUI].reset();
  }

  
  public flushAll(worldCamera: Camera, guiCamera: Camera) {
    this.renderTargets[RenderLayers.BackgroundDiffuse].flush(worldCamera);
    this.renderTargets[RenderLayers.ObjectsDiffuse].flush(worldCamera);
    this.renderTargets[RenderLayers.Collision].flush(worldCamera);
    this.renderTargets[RenderLayers.GUI].flush(guiCamera);
  }
}
