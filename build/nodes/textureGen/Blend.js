import { Vector3Raw } from "../../gl/Vector3.js";
import { ImageNode } from "./ImageNode.js";
import { Point } from "../../Point.js";
import { NodeSetting } from "../NodeSetting.js";
import { Color } from "../../Color.js";
export class Blend extends ImageNode {
    blendfunction;
    imageA;
    imageB;
    constructor() {
        super("Blend");
        this.blendfunction = this.AddSetting("function", "blend", "multiply");
        this.imageA = this.AddInput("base", "image");
        this.imageB = this.AddInput("blend", "image");
        this.updateHeight();
    }
    getBlendFunc(func) {
        const modes = {
            // Standard Darken: result is Target * Blend
            multiply: (a, b) => this.apply(a, b, (target, blend) => target * blend),
            // Standard Lighten: result is 1 – (1-Target) * (1-Blend)
            screen: (a, b) => this.apply(a, b, (target, blend) => 1 - (1 - target) * (1 - blend)),
            // Contrast: Uses Multiply if background < 0.5, Screen if background > 0.5
            overlay: (a, b) => this.apply(a, b, (target, blend) => target < 0.5 ? (2 * target * blend) : (1 - 2 * (1 - target) * (1 - blend))),
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
    apply(a, b, logic) {
        const blendChannel = (target, blend) => {
            const res = logic(target / 255, blend / 255) * 255;
            return Math.max(0, Math.min(255, res));
        };
        return new Color(blendChannel(a.r, b.r), blendChannel(a.g, b.g), blendChannel(a.b, b.b), a.a);
    }
    Process() {
        let func = this.blendfunction.getValue();
        let a = this.imageA.getValue();
        let b = this.imageA.getValue();
        let output = new ImageData(a.width, a.height);
        let destPixels = output.data;
        let bf = this.getBlendFunc(func);
        for (let i = 0; i < destPixels.length; i += 4) {
            let colorA = new Color(a.data[i], a.data[i + 1], a.data[i + 2], a.data[i + 3]);
            let colorB = new Color(b.data[i], b.data[i + 1], b.data[i + 2], b.data[i + 3]);
            let _c = bf(colorA, colorB);
            destPixels[i] = _c.r;
            destPixels[i + 1] = _c.g;
            destPixels[i + 2] = _c.b;
            destPixels[i + 3] = _c.a;
        }
        this.setOutputImage(output);
    }
}
//# sourceMappingURL=Blend.js.map