import { ImageNode } from "../ImageNode.js";
import { AssetStore } from "../../AssetStore.js";
import { Color } from "../../Color.js";
import { Rect } from "../../Rect.js";
export class RoundedRectangleNode extends ImageNode {
    image;
    color;
    _rect;
    radius;
    constructor(assetStore) {
        super("RoundedRect", "Rounded Rectangle", assetStore);
        this.image = this.AddInput("image", "image");
        this.color = this.AddInput("color", "color");
        this._rect = this.AddInput("rect", "rect");
        this.radius = this.AddInput("radius", "number");
        this.updateHeight();
    }
    Process(callback) {
        if (this.checkInputs(callback)) {
            let image = this.image.getValue();
            let color = this.color.getValue();
            let rect = this._rect.getValue();
            let radius = this.radius.getValue();
            let output = new ImageData(image.width, image.height);
            let destPixels = output.data;
            let sourcePixels = image.data;
            for (var i = 0; i < destPixels.length; ++i)
                destPixels[i] = sourcePixels[i];
            console.log(rect);
            console.log(color);
            console.log(destPixels);
            for (var x = Math.max(0, rect.x); x < Math.min(image.width, rect.x + rect.width); x += 1) {
                for (var y = Math.max(0, rect.y); y < Math.min(image.height, rect.y + rect.height); y += 1) {
                    if (this.isInsideRoundedRect(x, y, rect.x, rect.y, rect.width, rect.height, radius)) {
                        let i = ((y * output.width) + x) * 4;
                        destPixels[i] = color.r;
                        destPixels[i + 1] = color.g;
                        destPixels[i + 2] = color.b;
                        destPixels[i + 3] = color.a;
                    }
                }
            }
            this.setOutputImage(output);
        }
    }
    isInsideRoundedRect(px, py, x, y, w, h, r) {
        const maxR = Math.min(r, w / 2, h / 2);
        // Box test
        if (px < x || px >= x + w || py < y || py >= y + h)
            return false;
        // Distance from center of corners
        const dx = Math.abs(px - (x + w / 2)) - (w / 2 - maxR);
        const dy = Math.abs(py - (y + h / 2)) - (h / 2 - maxR);
        if (dx > 0 && dy > 0) {
            return (dx * dx + dy * dy) <= (maxR * maxR);
        }
        return true;
    }
}
//# sourceMappingURL=RoundedRectangleNode.js.map