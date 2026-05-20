import { ImageNode } from "./ImageNode.js";
import { LinearGradient } from "../../LinearGradient.js";
import { Color } from "../../Color.js";
import { Point } from "../../Point.js";
import { NodeSetting } from "../NodeSetting.js";
import { Gradient, GradientPoint } from "../../Gradient.js";
import { fullShade } from "./FullShade.js";
import { AssetStore } from "../../AssetStore.js";
export class LinearGradientNode extends ImageNode {
    width = 512;
    height = 512;
    gradient;
    constructor(assetStore) {
        super("LINEAR_GRADIENT", "Linear Gradient", assetStore);
        this.gradient = this.AddInput("gradient", "gradient", new Gradient([new GradientPoint(0, new Color(0, 255, 0, 255)), new GradientPoint(0.5, new Color(0, 0, 255, 255)), new GradientPoint(1, new Color(255, 0, 0, 255))]), assetStore);
        this.updateHeight();
    }
    Process() {
        let output = new ImageData(this.width, this.height);
        const myGradientLine = new LinearGradient(new Point(0, 0), new Point(1, 1), this.gradient.getValue());
        fullShade(output, (uv) => { return Color.asVector3(myGradientLine.getColorAtUV(new Point(uv.x, uv.y))); });
        this.setOutputImage(output);
    }
}
//# sourceMappingURL=LinearGradientNode.js.map