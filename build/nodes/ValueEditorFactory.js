import { ValueEditor } from "./ValueEditor.js";
import { NumberValueEditor } from "./valueEditors/NumberValueEditor.js";
import { PointValueEditor } from "./valueEditors/PointValueEditor.js";
import { ColorValueEditor } from "./valueEditors/ColorValueEditor.js";
import { RectValueEditor } from "./valueEditors/RectValueEditor.js";
import { BlendValueEditor } from "./valueEditors/BlendValueEditor.js";
export function valueEditorFactory(type) {
    switch (type) {
        case "image": return new ValueEditor();
        case "number": return new NumberValueEditor();
        case "point": return new PointValueEditor();
        case "color": return new ColorValueEditor();
        case "rect": return new RectValueEditor();
        case "blend": return new BlendValueEditor();
        default: return new ValueEditor();
    }
}
//# sourceMappingURL=ValueEditorFactory.js.map