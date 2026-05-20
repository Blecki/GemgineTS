import { ImageNode } from "./ImageNode.js";
import { Point } from "../../Point.js";
import { NodeSetting } from "../NodeSetting.js";
import { AssetStore } from "../../AssetStore.js";
export class Blit extends ImageNode {
    offset;
    repeat;
    base;
    source;
    constructor(assetStore) {
        super("BLIT", "Blit", assetStore);
        this.offset = this.AddSetting("offset", "point", new Point(512, 512), assetStore);
        this.repeat = this.AddSetting("repeat", "point", new Point(512, 512), assetStore);
        this.base = this.AddInput("base", "image");
        this.source = this.AddInput("source", "image");
        this.updateHeight();
    }
    Process() {
        let base = this.base.getValue();
        let source = this.source.getValue();
        let offset = this.offset.getValue();
        let repeat = this.repeat.getValue();
        let output = new ImageData(base.width, base.height);
        for (var x = offset.x; x < base.width; x += repeat.x)
            for (var y = offset.y; y < base.height; y += repeat.y)
                this.blit(source, output, x, y);
        this.setOutputImage(output);
    }
    blit(source, dest, x, y) {
        let destPixels = dest.data;
        let sourcePixels = source.data;
        for (var dx = x, sx = 0; dx < dest.width && sx < source.width; dx += 1, sx += 1) {
            for (var dy = y, sy = 0; dy < dest.height && sy < source.height; dy += 1, sy += 1) {
                let di = ((dy * dest.width) + dx) * 4;
                let si = ((sy * source.width) + sx) * 4;
                destPixels[di] = sourcePixels[si];
                destPixels[di + 1] = sourcePixels[si + 1];
                destPixels[di + 2] = sourcePixels[si + 2];
                destPixels[di + 3] = sourcePixels[si + 3];
            }
        }
    }
}
//# sourceMappingURL=Blit.js.map