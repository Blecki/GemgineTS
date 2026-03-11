import { Node } from "../Node.js";
import { type Vector3, Vector3Raw } from "../../gl/Vector3.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { Rect } from "../../Rect.js";
import { Point } from "../../Point.js";
import { EditorContext } from "../../editor/EditorContext.js";
import { NodeSet } from "../NodeSet.js";
import { OutputTerminal } from "../OutputTerminal.js";
import { type Vector2, Vector2Raw } from "../../gl/Vector2.js";

export type ShadeFunction = (uv: Vector2) => Vector3; 


export class ImageNode extends Node {
  public outputImage: OutputTerminal;
  public cachedImage: ImageBitmap | null = null;

  constructor(nodeName: string) {
    super(nodeName);
    this.outputImage = this.AddOutput("image", "image");
  }

  public updateHeight() : void {
    super.updateHeight();
    this.rect.height += this.rect.width;
  }

  static getCenteredFitRect(srcW: number, srcH: number, dest: Rect): Rect {
    // 1. Calculate the scale factor to fit the image inside the container
    const scale = Math.min(dest.width / srcW, dest.height / srcH);

    // 2. Apply scale to get new dimensions
    const width = srcW * scale;
    const height = srcH * scale;

    // 3. Center the new dimensions within the destination rectangle's space
    const x = dest.x + (dest.width - width) / 2;
    const y = dest.y + (dest.height - height) / 2;

    return new Rect(x, y, width, height);
  }

  public draw(ctx: RenderTarget2D, editor: EditorContext, nodeEditor: NodeSet) {
    super.draw(ctx, editor, nodeEditor);
    if (this.cachedImage != null) {
      let destRect = ImageNode.getCenteredFitRect(this.cachedImage.width, this.cachedImage.height, new Rect(this.rect.x + 2, this.rect.y + this.rect.height - this.rect.width + 4, this.rect.width - 4, this.rect.width - 4));
      ctx.drawImageDR(this.cachedImage, new Rect(0, 0, this.cachedImage.width, this.cachedImage.height), destRect);
    }
  }

  public setOutputImage(data: ImageData) {
    this.outputImage.setValue(data);
    createImageBitmap(data).then(bmp => this.cachedImage = bmp);
  }  
  
  static putPixel(image: ImageData, x: number, y: number, color: Vector3) {
    let pixels = image.data;
    const index = (x + y * image.width) * 4;
    pixels[index] = color.x;
    pixels[index + 1] = color.y;
    pixels[index + 2] = color.z;
    pixels[index + 3] = 255;
  }
  
  static fullShade(image: ImageData, shader: ShadeFunction) : void {
    let pixels = image.data;
    for (let i = 0; i < pixels.length; i += 4) {
      let u = Math.floor((i % (image.width * 4)) / 4) / image.width;
      let v = Math.floor(i / (image.width * 4)) / image.height;
      let color = shader(new Vector2Raw(u, v));
      pixels[i] = color.x;
      pixels[i+1] = color.y;
      pixels[i+2] = color.z;
      pixels[i+3] = 255;
    }
  }
  
  static Fill(image: ImageData, color: Vector3) : void {
    ImageNode.fullShade(image, (uv) => color);
  }
}