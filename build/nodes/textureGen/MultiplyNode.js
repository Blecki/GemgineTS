import { ImageNode } from "../ImageNode.js";
import { AssetStore } from "../../AssetStore.js";
import { Color } from "../../Color.js";
export class MultiplyNode extends ImageNode {
    image;
    color;
    constructor(assetStore) {
        super("Multiply", "Multiply", assetStore);
        this.image = this.AddInput("image", "image");
        this.color = this.AddInput("color", "color");
        this.updateHeight();
    }
    Process(callback) {
        if (this.checkInputs(callback)) {
            let image = this.image.getValue();
            let color = this.color.getValue();
            let output = new ImageData(image.width, image.height);
            let destPixels = output.data;
            let sourcePixels = image.data;
            let r = color.r / 255;
            let g = color.g / 255;
            let b = color.b / 255;
            let a = color.a / 255;
            for (var x = 0; x < image.width; x += 1) {
                for (var y = 0; y < image.height; y += 1) {
                    let i = ((y * image.width) + x) * 4;
                    destPixels[i] = sourcePixels[i] * r;
                    destPixels[i + 1] = sourcePixels[i + 1] * g;
                    destPixels[i + 2] = sourcePixels[i + 2] * b;
                    destPixels[i + 3] = sourcePixels[i + 3] * a;
                }
            }
            this.setOutputImage(output);
        }
    }
}
//# sourceMappingURL=MultiplyNode.js.map