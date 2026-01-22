import { componentType } from "./Component.js";
import { RenderComponent } from "./RenderModule.js";
import { RenderContext } from "./RenderContext.js";
import { AssetStore } from "./AssetStore.js";
import { RenderLayers } from "./RenderLayers.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";


@componentType("DebugGizmo")
export class DebugGizmoComponent extends RenderComponent {  
  private point: ImageBitmap | null = null;
  public initialize(engine: AssetStore, template: TiledTemplate, prototypeAsset: AssetReference) 
  {
    this.point = engine.getPreloadedAsset("assets/point.png").asset;
    this.renderLayer = RenderLayers.ObjectsDiffuse;
  }  
  public render(context: RenderContext): void {
    if (this.parent != null) {
      var ctx = context.getTarget(RenderLayers.ObjectsDiffuse);
      ctx.drawRectangle(this.parent.globalBounds, 'rgba(255, 0, 0, 0.5)');
      if (this.point != null)
        ctx.drawImage(this.point, new Rect(0, 0, this.point.width, this.point.height), new Point(this.parent.globalPosition.x - 2, this.parent.globalPosition.y - 2));
    }
  }
}
