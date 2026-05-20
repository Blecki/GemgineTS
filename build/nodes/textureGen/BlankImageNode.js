import { ImageNode } from "../ImageNode.js";
import { Point } from "../../Point.js";
import { Color } from "../../Color.js";
import { AssetStore } from "../../AssetStore.js";
export class BlankImageNode extends ImageNode {
    dimensions;
    color;
    constructor(assetStore) {
        super("BlankImage", "Blank Image", assetStore);
        this.dimensions = this.AddInput("dimensions", "point");
        this.color = this.AddInput("color", "color");
        this.updateHeight();
    }
    Process(callback) {
        if (this.checkInputs(callback)) {
            let _dim = this.dimensions.getValue();
            let _c = this.color.getValue();
            let output = new ImageData(_dim.x, _dim.y);
            let pixels = output.data;
            for (let i = 0; i < pixels.length; i += 4) {
                pixels[i] = _c.r;
                pixels[i + 1] = _c.g;
                pixels[i + 2] = _c.b;
                pixels[i + 3] = _c.a;
            }
            this.setOutputImage(output);
        }
    }
}
//# sourceMappingURL=BlankImageNode.js.map