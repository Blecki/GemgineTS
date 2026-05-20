import { Vector3Raw } from "../../gl/Vector3.js";
import { ImageNode } from "../ImageNode.js";
import { TilingPerlin } from "../../PerlinNoise.js";
import { Vector2Raw } from "../../gl/Vector2.js";
import { fullShade } from "../FullShade.js";
import { AssetStore } from "../../AssetStore.js";
import { Point } from "../../Point.js";
import { InputTerminal } from "../InputTerminal.js";
export class NoiseNode extends ImageNode {
    dimensions;
    constructor(assetStore) {
        super("Noise", "noise", assetStore);
        this.dimensions = this.AddInput("dimensions", "point");
        this.updateHeight();
    }
    Process(callback) {
        if (this.checkInputs(callback)) {
            let _dim = this.dimensions.getValue();
            let output = new ImageData(_dim.x, _dim.y);
            let noise = new TilingPerlin();
            fullShade(output, (uv) => { return NoiseNode.noiseAt(uv, noise); });
            this.setOutputImage(output);
        }
    }
    static noiseAt(at, perlin) {
        let noise = perlin.get(at.x, at.y, 16, 16);
        return new Vector3Raw((noise + 1) * 128, (noise + 1) * 128, (noise + 1) * 128);
    }
}
//# sourceMappingURL=NoiseNode.js.map