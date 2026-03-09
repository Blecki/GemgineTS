import { Fluent } from "./../Fluent.js";
import { PropertyGrid } from "./PropertyGrid.js";
export class Editor {
    backingObject;
    static isEditableObject(object) {
        return 'createEditor' in object;
    }
    static createEditorForObject(object) {
        if (this.isEditableObject(object))
            return object.createEditor();
        else
            return new PropertyGrid(object);
    }
    constructor(backingObject) {
        this.backingObject = backingObject;
    }
    render(fluent) {
        return fluent.div()._append("UNIMPLEMENTED EDITOR");
    }
}
//# sourceMappingURL=Editor.js.map