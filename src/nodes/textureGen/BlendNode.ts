import { ImageNode } from "../ImageNode.js";
import { NodeSetting } from "../NodeSetting.js";
import { Color } from "../../Color.js";
import type { InputTerminal } from "../InputTerminal.js";
import { AssetStore } from "../../AssetStore.js";
import type { enqueueNodeForUpdateCallback } from "../Node.js";

export class BlendNode extends ImageNode {
  public blendfunction: NodeSetting;
  public imageA: InputTerminal;
  public imageB: InputTerminal;

  constructor(assetStore: AssetStore) {
    super("Blend", "Blend", assetStore);
    this.blendfunction = this.AddSetting("function", "blend", "multiply", assetStore);
    this.imageA = this.AddInput("base", "image");
    this.imageB = this.AddInput("blend", "image");
    this.updateHeight();
  }

  public getBlendFunc(func: string): (a: Color, b: Color) => Color {
    const modes: Record<string, (a: Color, b: Color) => Color> = {
      // Standard Darken: result is Target * Blend
      multiply: (a, b) => this.apply(a, b, (target, blend) => target * blend),

      // Standard Lighten: result is 1 – (1-Target) * (1-Blend)
      screen: (a, b) => this.apply(a, b, (target, blend) => 1 - (1 - target) * (1 - blend)),

      // Contrast: Uses Multiply if background < 0.5, Screen if background > 0.5
      overlay: (a, b) => this.apply(a, b, (target, blend) => 
        target < 0.5 ? (2 * target * blend) : (1 - 2 * (1 - target) * (1 - blend))
      ),

      // Comparative: Absolute difference between pixels
      difference: (a, b) => this.apply(a, b, (target, blend) => Math.abs(target - blend)),

      // Normal: Simple replacement (Source over Backdrop)
      normal: (a, b) => b,
    };

    return modes[func] || ((a, b) => a);
  }

  /**
   * Helper to normalize colors (0-255 to 0-1), apply logic per channel,
   * and clamp the result back to 0-255.
   */
  private apply(a: Color, b: Color, logic: (t: number, bl: number) => number): Color {
    const blendChannel = (target: number, blend: number) => {
      const res = logic(target / 255, blend / 255) * 255;
      return Math.max(0, Math.min(255, res));
    };

    return new Color(blendChannel(a.r, b.r), blendChannel(a.g, b.g), blendChannel(a.b, b.b), a.a);
  }

  public Process(callback: enqueueNodeForUpdateCallback) : void {
    if (this.checkInputs(callback)) {
      let func = this.blendfunction.getValue() as string;
      let a = this.imageA.getValue() as ImageData;
      let b = this.imageA.getValue() as ImageData;
      
      let output = new ImageData(a.width, a.height);
      let destPixels = output.data;
      let bf = this.getBlendFunc(func);
      
      for (let i = 0; i < destPixels.length; i += 4) {
        let colorA = new Color(a.data[i], a.data[i + 1], a.data[i + 2], a.data[i + 3]);
        let colorB = new Color(b.data[i], b.data[i + 1], b.data[i + 2], b.data[i + 3]);
        let _c = bf(colorA, colorB);
        destPixels[i] = _c.r;
        destPixels[i+1] = _c.g;
        destPixels[i+2] = _c.b;
        destPixels[i+3] = _c.a;
      }
      this.setOutputImage(output);
    }
  }
}