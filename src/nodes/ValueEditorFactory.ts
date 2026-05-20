import { ValueEditor } from "./ValueEditor.js";
import { NumberValueEditor } from "./valueEditors/NumberValueEditor.js";
import { PointValueEditor } from "./valueEditors/PointValueEditor.js";
import { ColorValueEditor } from "./valueEditors/ColorValueEditor.js";
import { RectValueEditor } from "./valueEditors/RectValueEditor.js";
import { BlendValueEditor } from "./valueEditors/BlendValueEditor.js";
import { GradientValueEditor } from "./valueEditors/GradientValueEditor.js";
import { AssetStore } from "../AssetStore.js";

export function valueEditorFactory(type: String, assetStore: AssetStore) {
  switch (type) {
    case "image": return new ValueEditor(assetStore);
    case "number": return new NumberValueEditor(assetStore);
    case "point": return new PointValueEditor(assetStore);
    case "color": return new ColorValueEditor(assetStore);
    case "rect": return new RectValueEditor(assetStore);
    case "blend": return new BlendValueEditor(assetStore);
    case "gradient": return new GradientValueEditor(assetStore);
    default: return new ValueEditor(assetStore);
  }
}

