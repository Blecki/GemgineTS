import { Vector3Raw } from "../../gl/Vector3.js";
import { Rect } from "../../Rect.js";
import { ImageNode } from "./ImageNode.js";
import { EditorContext } from "../../editor/EditorContext.js";
import { NodeSet } from "../NodeSet.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { InputTerminal } from "../InputTerminal.js";
export class Rectangle extends ImageNode {
    rect = new Rect(32, 32, 32, 32);
    inputImage;
    inputRect;
    inputColor;
    constructor() {
        super("rect");
        this.inputImage = this.AddInput("image", "image");
        this.inputRect = this.AddInput("rect", "Rect");
        this.inputColor = this.AddInput("color", "Vector3");
        this.updateHeight();
    }
    Process() {
        let inputImage = this.inputImage.getValue();
        if (inputImage != null) {
            let inputRect = this.inputRect.getValue();
            let inputColor = this.inputColor.getValue();
            let output = new ImageData(inputImage.data, inputImage.width, inputImage.height);
            let pixels = output.data;
            for (let x = Math.max(0, inputRect.x); x < Math.min(inputImage.width, inputRect.x + inputRect.width); ++x)
                for (let y = Math.max(0, inputRect.y); y < Math.min(inputImage.height, inputRect.y + inputRect.height); ++y) {
                    let i = (y * inputImage.width * 4) + (x * 4);
                    pixels[i] = inputColor.x;
                    pixels[i + 1] = inputColor.y;
                    pixels[i + 2] = inputColor.z;
                    pixels[i + 3] = 255;
                }
            this.setOutputImage(output);
        }
    }
    draw(ctx, editor, nodeEditor) {
        super.draw(ctx, editor, nodeEditor);
    }
}
//# sourceMappingURL=Rectangle.js.map