import { ImageNode } from "../ImageNode.js";
import { LinearGradient } from "../../LinearGradient.js";
import { Color } from "../../Color.js";
import { Point } from "../../Point.js";
import { Gradient } from "../../Gradient.js";
import { fullShade } from "../FullShade.js";
import { AssetStore } from "../../AssetStore.js";
export class DrawLinearGradientNode extends ImageNode {
    gradient;
    dimensions;
    start;
    end;
    constructor(assetStore) {
        super("DrawLinearGradient", "Linear Gradient", assetStore);
        this.gradient = this.AddInput("gradient", "gradient");
        this.dimensions = this.AddInput("dimensions", "point");
        this.start = this.AddInput("start", "point");
        this.end = this.AddInput("end", "point");
        this.updateHeight();
    }
    Process(callback) {
        if (this.checkInputs(callback)) {
            let dims = this.dimensions.getValue();
            let output = new ImageData(dims.x, dims.y);
            const myGradientLine = new LinearGradient(this.start.getValue(), this.end.getValue(), this.gradient.getValue());
            fullShade(output, (uv) => { return Color.asVector3(myGradientLine.getColorAtUV(new Point(uv.x, uv.y))); });
            this.setOutputImage(output);
        }
    }
}
//# sourceMappingURL=DrawLinearGradientNode.js.map