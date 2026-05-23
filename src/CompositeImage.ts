import { IndexedImage } from "./IndexedImage.js";
import { Palette } from "./Palette.js";

export class CompositeImageLayer {
  public baseImage: IndexedImage | null = null;
  public palette: Palette | null = null;

  constructor (baseImage: IndexedImage, palette: Palette) {
    this.baseImage = baseImage;
    this.palette = palette;
  }
}

export class CompositeImage {
  public layers: CompositeImageLayer[] = [];

  public compose(): ImageBitmap | null {
    let maxWidth = 0;
    let maxHeight = 0;
    this.layers.forEach(l => {
      if (l.baseImage != null) {
        if (l.baseImage.width > maxWidth) maxWidth = l.baseImage.width;
        if (l.baseImage.height > maxHeight) maxHeight = l.baseImage.height;
      }
    });
    if (maxWidth == 0 || maxHeight == 0) return null;
    const canvas = new OffscreenCanvas(maxWidth, maxHeight);
    const ctx = canvas.getContext('2d');
		if (ctx == null) throw new Error("Could not create context from off screen canvas.");
    this.layers.forEach(l => {
      if (l.baseImage != null && l.palette != null) {
        let image = l.baseImage?.toImageBitmap(l.palette);
        ctx.drawImage(image, 0, 0);
      }
    });
    return canvas.transferToImageBitmap();
  }
}