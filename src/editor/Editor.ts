import { Fluent, type FluentElement } from "./../Fluent.js";
import { PropertyGrid } from "./PropertyGrid.js";

export interface EditableObject {
  createEditor(): Editor;
}

export class Editor {
  public backingObject: any;

  public static isEditableObject(object: any): object is EditableObject {
    return 'createEditor' in object;
  }

  public static createEditorForObject(object: any) : Editor {
    if (this.isEditableObject(object)) return object.createEditor();
    else return new PropertyGrid(object);
  }

  public constructor(backingObject: any) {
    this.backingObject = backingObject;
  }

  public render() : FluentElement {
    return Fluent.div()._append("UNIMPLEMENTED EDITOR");
  }
}
