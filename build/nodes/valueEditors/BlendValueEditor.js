import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent } from "../../Fluent.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { ComboBox } from "../../editor/ComboBox.js";
import { AssetStore } from "../../AssetStore.js";
export class BlendValueEditor extends ValueEditor {
    raw = "normal";
    comboBox;
    constructor(assetStore) {
        super(assetStore);
        this.comboBox = new ComboBox(new Rect(0, 0, 1, 1), [
            "normal",
            "multiply",
            "screen",
            "overlay",
            "difference"
        ]);
    }
    draw(ctx, editor, drawArea) {
        this.comboBox.rect = drawArea;
        this.raw = this.comboBox.gui(editor, this.raw);
    }
    setValue(v) {
        this.raw = `${v}`;
    }
    getValue() {
        return this.raw;
    }
}
//# sourceMappingURL=BlendValueEditor.js.map