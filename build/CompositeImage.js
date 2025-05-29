export class CompositeImageLayer {
    baseImage = null;
    palette = null;
    constructor(baseImage, palette) {
        this.baseImage = baseImage;
        this.palette = palette;
    }
}
export class CompositeImage {
    layers = [];
    compose() {
        let maxWidth = 0;
        let maxHeight = 0;
        this.layers.forEach(l => {
            if (l.baseImage != null) {
                if (l.baseImage.width > maxWidth)
                    maxWidth = l.baseImage.width;
                if (l.baseImage.height > maxHeight)
                    maxHeight = l.baseImage.height;
            }
        });
        if (maxWidth == 0 || maxHeight == 0)
            return null;
        const canvas = new OffscreenCanvas(maxWidth, maxHeight);
        const ctx = canvas.getContext('2d');
        if (ctx == null)
            throw new Error("Could not create context from off screen canvas.");
        this.layers.forEach(l => {
            if (l.baseImage != null && l.palette != null) {
                let image = l.baseImage?.toImageBitmap(l.palette);
                ctx.drawImage(image, 0, 0);
            }
        });
        return canvas.transferToImageBitmap();
    }
}
//# sourceMappingURL=CompositeImage.js.map