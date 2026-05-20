import { Rect } from "../Rect.js";
import { Point } from "../Point.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { AssetStore } from "../AssetStore.js";
export class ValueEditor {
    cachedValue;
    constructor(assetStore) { }
    getDimensions() {
        return new Point(80, 30);
    }
    getValue() {
        return this.cachedValue;
    }
    setValue(v) {
        this.cachedValue = v;
    }
    serialize() {
        return this.getValue();
    }
    deserialize(v) {
        this.setValue(v);
    }
    draw(ctx, editor, drawArea) { }
}
//# sourceMappingURL=ValueEditor.js.map