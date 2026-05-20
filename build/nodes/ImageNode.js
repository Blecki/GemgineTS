import { Node } from "./Node.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Rect } from "../Rect.js";
import { EditorContext } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { OutputTerminal } from "./OutputTerminal.js";
import { AssetStore } from "../AssetStore.js";
import { GuiAssets } from "./GuiAssets.js";
export class ImageNode extends Node {
    outputImage;
    cachedImage = null;
    constructor(nodeType, nodeName, assetStore) {
        super(nodeType, nodeName, assetStore);
        this.outputImage = this.AddOutput("image", "image");
    }
    updateHeight() {
        super.updateHeight();
        this.rect.height += this.rect.width;
    }
    static getCenteredFitRect(srcW, srcH, dest) {
        // 1. Calculate the scale factor to fit the image inside the container
        const scale = Math.min(dest.width / srcW, dest.height / srcH);
        // 2. Apply scale to get new dimensions
        const width = srcW * scale;
        const height = srcH * scale;
        // 3. Center the new dimensions within the destination rectangle's space
        const x = dest.x + (dest.width - width) / 2;
        const y = dest.y + (dest.height - height) / 2;
        return new Rect(x, y, width, height);
    }
    draw(ctx, editor, nodeEditor, guiAssets, callback) {
        super.draw(ctx, editor, nodeEditor, guiAssets, callback);
        if (this.cachedImage != null) {
            let destRect = ImageNode.getCenteredFitRect(this.cachedImage.width, this.cachedImage.height, new Rect(this.rect.x + 2, this.rect.y + this.rect.height - this.rect.width + 4, this.rect.width - 4, this.rect.width - 4));
            ctx.drawImageDR(this.cachedImage, new Rect(0, 0, this.cachedImage.width, this.cachedImage.height), destRect);
        }
    }
    setOutputImage(data) {
        this.outputImage.setValue(data);
        createImageBitmap(data).then(bmp => this.cachedImage = bmp);
    }
}
//# sourceMappingURL=ImageNode.js.map