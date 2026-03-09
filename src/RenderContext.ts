import { Camera } from "./Camera.js";
import { RenderTarget2D } from "./RenderTarget2D.js";
import { RenderLayers } from "./RenderLayers.js"

type DrawTask = (context: CanvasRenderingContext2D, camera: Camera) => void;
type TargetDirectory = Record<RenderLayers, RenderTarget2D>;

export class RenderContext {
  private renderTargets: TargetDirectory;

  constructor(width: number, height: number, gl: WebGL2RenderingContext) {
    this.renderTargets = {
      [RenderLayers.BackgroundDiffuse]: new RenderTarget2D(width, height, gl),
      [RenderLayers.ObjectsDiffuse]: new RenderTarget2D(width, height, gl),
      [RenderLayers.Collision]: new RenderTarget2D(width, height, gl),
      [RenderLayers.GUI]: new RenderTarget2D(width, height, gl)
    };
  }

  public getTarget(layer: RenderLayers): RenderTarget2D {
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
