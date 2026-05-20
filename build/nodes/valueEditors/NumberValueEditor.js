import { Rect } from "../../Rect.js";
import { ValueEditor } from "../ValueEditor.js";
import { Fluent } from "../../Fluent.js";
import { EditorContext, HandleProperties } from "../../editor/EditorContext.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { AssetStore } from "../../AssetStore.js";
export class NumberValueEditor extends ValueEditor {
    raw = "0";
    constructor(assetStore) {
        super(assetStore);
    }
    draw(ctx, editor, drawArea) {
        this.raw = editor.numberField(new Rect(drawArea.x + 20, drawArea.y, 60, 24), this.raw);
    }
    setValue(v) {
        this.raw = `${v}`;
    }
    getValue() {
        return parseInt(this.raw);
    }
}
//# sourceMappingURL=NumberValueEditor.js.map