import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Point } from "../../Point.js";
import { EditorContext } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { Color } from "../../Color.js";
import { Gradient, GradientPoint } from "../../Gradient.js";
import { LinearGradient } from "../../LinearGradient.js";
import { Node } from "../Node.js";
import { fullShade } from "../FullShade.js";
import { AssetStore } from "../../AssetStore.js";
import { ColorValueEditor } from "./ColorValueEditor.js";
import { NumberValueEditor } from "./NumberValueEditor.js";

export class GradientValueEditor extends ValueEditor {
  protected gradient: Gradient | null = null;
  protected linearGradient: LinearGradient | null = null;
  private cachedGradientImage: ImageBitmap | null = null;
  private cachedGradientImageData: ImageData = new ImageData(190, 24);
  private handleImage: ImageBitmap | null = null;
  private selectedGradientdPoint: GradientPoint | null = null;
  private colorValueEditor: ColorValueEditor;
  private previewWidth: number = 190;

  constructor(assetStore: AssetStore) {
    super(assetStore);
    assetStore.loadAsset("assets/gradient-point.png").then(assetRef => { console.log(assetRef); this.handleImage = assetRef.asset; });
    this.colorValueEditor = new ColorValueEditor(assetStore);
  }

  refreshImage() : void {
    if (this.linearGradient != null) {
      fullShade(this.cachedGradientImageData, (uv) => { return Color.asVector3(this.linearGradient?.getColorAtUV(new Point(uv.x, uv.y)) ?? Color.White); });
      createImageBitmap(this.cachedGradientImageData).then(bmp => this.cachedGradientImage = bmp);
    }
  }

  getDimensions() : Point {
    return new Point(this.previewWidth + 16, 110);
  }

  draw(ctx: RenderTarget2D, editor: EditorContext, drawArea: Rect): void {
    drawArea = drawArea.lrtb(8,8,0,0);
    if (this.cachedGradientImage != null)
      editor.widget(new Rect(drawArea.x, drawArea.y + 30, this.previewWidth, 24), { fill: "", border: "", image: this.cachedGradientImage }).ifMouseDown(e => {
        let newPointPosition = (e.mousePosition.x - drawArea.x) / this.previewWidth;
        this.gradient?.points.push(new GradientPoint(newPointPosition, this.gradient.getColorAt(newPointPosition)));
        this.gradient?.sortPoints();
        e.handled = true;
      });

    if (this.gradient != null) {
      if (this.gradient.points.length >= 2) {
        this.drawGradientPoint(ctx, editor, drawArea, true, this.gradient.points[0], null, null);
        this.drawGradientPoint(ctx, editor, drawArea, true, this.gradient.points[this.gradient.points.length - 1], null, null);
      }

      for (var x = 1; x < this.gradient.points.length - 1; ++x)
        this.drawGradientPoint(ctx, editor, drawArea, false, this.gradient.points[x], this.gradient.points[x - 1], this.gradient.points[x + 1]);

      if (this.selectedGradientdPoint != null) {
        let colorRect = new Rect(drawArea.x, drawArea.y + 56, this.previewWidth, 48);
        this.colorValueEditor.setValue(this.selectedGradientdPoint.color);
        this.colorValueEditor.draw(ctx, editor, colorRect);
        this.selectedGradientdPoint.color = this.colorValueEditor.getValue();
        this.refreshImage();
      }
    }
  }

  drawGradientPoint(ctx: RenderTarget2D, editor: EditorContext, drawArea: Rect, locked: boolean, point: GradientPoint, pointBefore: GradientPoint | null, pointAfter: GradientPoint | null)
  {
    let xPoint = this.previewWidth * point.duration;
    let destRect = new Rect(drawArea.x + xPoint - 6, drawArea.y + 16, 12, 12);
    let widget = editor.widget(destRect, { /*image: this.handleImage,*/ fill: "", border: "" });

    ctx.drawCustom(context => {
      const radius = 6;
  
      context.save();
      context.translate(destRect.x + 6, destRect.y + 6);
      context.beginPath();
      
      // Top Circle (start at 0, -radius)
      context.arc(0, -radius, radius, Math.PI * 0.85, Math.PI * 0.15);
      
      // Bottom Tapered Point
      context.bezierCurveTo(
        radius * 0.7, 0, // Control point 1
        0, 12 * 1.2,   // Bottom point
        -radius * 0.7, 0 // Control point 2
      );
      
      context.closePath();
      
      // Style
      if (locked) context.fillStyle = '#000000';
      else context.fillStyle = '#880000';
      context.fill();
      context.strokeStyle = '#ffffff';
      context.lineWidth = 2;
      context.stroke();
      
      context.restore();

    });

    if (!locked)
      widget.ifDragged(w => {
        point.duration += w.mouseDelta.x / this.previewWidth;
        if (pointBefore != null)
          if (point.duration < (pointBefore.duration + 0.01)) 
            point.duration = pointBefore.duration + 0.01;
        if (pointAfter != null)
          if (point.duration > (pointAfter.duration - 0.01)) 
            point.duration = pointAfter.duration - 0.01;
      });
    widget.ifMouseDown(w => {
      this.selectedGradientdPoint = point;
      w.handled = true;
    });
  }

  serialize() : any {
    return {
      POINTS: this.gradient?.points.map(p => { return { DURATION: p.duration, COLOR: p.color }; }) ?? []
    };
  }

  deserialize(v: any) : void {
    this.setValue(new Gradient(v));
  }

  setValue(v: any): void {
    this.gradient = v as Gradient;
    this.linearGradient = new LinearGradient(new Point(0, 0), new Point(1, 0), this.gradient);
    this.selectedGradientdPoint = this.gradient.points[0];
    this.refreshImage();
  }

  getValue() : any {
    return this.gradient;
  }
}
