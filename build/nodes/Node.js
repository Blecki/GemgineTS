import { Rect } from "../Rect.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { NodeSet } from "./NodeSet.js";
import { Fluent } from "../Fluent.js";
import { valueEditorFactory, ValueEditor } from "./ValueEditor.js";
import { InputTerminal } from "./InputTerminal.js";
import { OutputTerminal } from "./OutputTerminal.js";
export class Node {
    rect = new Rect(0, 0, 220, 100);
    inputs = [];
    outputs = [];
    name;
    AddOutput(name, type) {
        let r = new OutputTerminal(name, type, this, this.outputs.length);
        this.outputs.push(r);
        return r;
    }
    AddInput(name, type) {
        let r = new InputTerminal(name, type, this, this.inputs.length);
        this.inputs.push(r);
        return r;
    }
    updateHeight() {
        this.rect.height = 30 + (54 * Math.max(this.inputs.length, this.outputs.length));
    }
    Process() {
    }
    positionInputs() {
        let yOffset = 30;
        for (let input = 0; input < this.inputs.length; ++input) {
            let inputDimensions = this.inputs[input].getDimensions();
            this.inputs[input].setDrawArea(new Rect(this.rect.x + 4, this.rect.y + yOffset, inputDimensions.x, inputDimensions.y));
            yOffset += inputDimensions.y + 4;
        }
    }
    positionOutputs() {
        let yOffset = 30;
        for (let output = 0; output < this.outputs.length; ++output) {
            let outputDimensions = this.outputs[output].getDimensions();
            this.outputs[output].setDrawArea(new Rect(this.rect.x + this.rect.width - outputDimensions.x - 2, this.rect.y + yOffset, outputDimensions.x, outputDimensions.y));
            yOffset += outputDimensions.y + 4;
        }
    }
    draw(ctx, editor, nodeSet) {
        ctx.drawRectangle(this.rect.withOffset(new Point(0, 0)), "#000000");
        ctx.drawString(this.name, this.rect.origin.add(new Point(8, 4)), "#ffffff");
        ctx.drawWireRectangle(this.rect.withOffset(new Point(0, 0)), "#f0f0f0");
        this.positionInputs();
        for (let input = 0; input < this.inputs.length; ++input) {
            this.inputs[input].draw(ctx, editor, nodeSet);
        }
        this.positionOutputs();
        for (let output = 0; output < this.outputs.length; ++output)
            this.outputs[output].draw(ctx, editor, nodeSet);
        editor.translateHandle(new Rect(this.rect.x + 4, this.rect.y + 4, this.rect.width / 2, 20), new HandleProperties("#b08026", "#f99d1c")).ifDragged(handle => {
            this.rect.x += handle.delta.x;
            this.rect.y += handle.delta.y;
        });
        editor.button(new Rect(this.rect.x + this.rect.width - 24, this.rect.y + 2, 22, 22)).ifClicked(button => {
            console.log("Refresh button clicked.");
            this.Process();
        });
    }
    constructor(name) {
        this.name = name;
    }
}
//# sourceMappingURL=Node.js.map