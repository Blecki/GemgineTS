import { Vector3Raw } from "../../gl/Vector3.js";
import { ImageNode } from "./ImageNode.js";
import { TilingPerlin } from "../../PerlinNoise.js";
import { Vector2Raw } from "../../gl/Vector2.js";
export class Noise extends ImageNode {
    width = 512;
    height = 512;
    constructor() {
        super("noise");
        this.updateHeight();
    }
    Process() {
        let output = new ImageData(this.width, this.height);
        let noise = new TilingPerlin();
        ImageNode.fullShade(output, (uv) => { return Noise.noiseAt(uv, noise); });
        this.setOutputImage(output);
    }
    static noiseAt(at, perlin) {
        let noise = perlin.get(at.x, at.y, 16, 16);
        return new Vector3Raw((noise + 1) * 128, (noise + 1) * 128, (noise + 1) * 128);
    }
}
//# sourceMappingURL=Noise.js.map