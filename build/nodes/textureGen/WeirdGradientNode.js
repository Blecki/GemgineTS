import { ImageNode } from "./ImageNode.js";
import { LinearGradient } from "../../LinearGradient.js";
import { Gradient } from "../../Gradient.js";
import { Color } from "../../Color.js";
import { Point } from "../../Point.js";
import { fullShade } from "./FullShade.js";
import { AssetStore } from "../../AssetStore.js";
export class WeirdGradientNode extends ImageNode {
    width = 512;
    height = 512;
    constructor(assetStore) {
        super("WEIRD_GRADIENT", "Weird Gradient", assetStore);
        this.updateHeight();
    }
    Process() {
        let output = new ImageData(this.width, this.height);
        // Temporary constant gradient, need value editors.
        const white = new Color(255, 255, 255, 255);
        const black = new Color(0, 0, 0, 255);
        const diagonalGradient = new Gradient([
            { duration: 0.0, color: white },
            { duration: 1.0, color: black }
        ]);
        fullShade(output, (uv) => {
            let gradientSpace = Math.abs(uv.x - 0.5) + Math.abs(uv.y - 0.5);
            return Color.asVector3(diagonalGradient.getColorAt(gradientSpace * 2));
        });
        this.setOutputImage(output);
    }
}
//# sourceMappingURL=WeirdGradientNode.js.map