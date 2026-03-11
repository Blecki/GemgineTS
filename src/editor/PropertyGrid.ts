import { Fluent, type FluentElement } from "./../Fluent.js";
import { Editor } from "./Editor.js";

type PrimitiveEditor = {
  setValue(value: any) : void;
  getElement() : FluentElement;
}

export interface EditorPrimitive {
  createEditor(f: Fluent): PrimitiveEditor;
}

export class PropertyGrid extends Editor {
  public element: FluentElement | undefined = undefined;

  public static isEditorPrimitive(object: any): object is EditorPrimitive {
    return 'createEditor' in object;
  }

  public constructor(backingObject: any) {
    super(backingObject);
  }

  public render() {
   
    this.element = Fluent.div();
    this.element._append(Fluent.div()._style({backgroundColor: "blue", color: "white"})._append(`${this.backingObject.constructor.name}`));

    for (const [key, value] of Object.entries(this.backingObject)) {
      let propDiv = this.makePropDiv(key, value);
      propDiv?._style({border: "1px solid black", marginLeft: "8px"});
      this.element._append(propDiv);
    }

    return this.element;
  }

  private makePropDiv(propName: string, propValue: any): FluentElement {
    if (Fluent == null)
      throw "No fluent on property grid object";
    
    if (propValue == null) {
      return Fluent.div()._append(propName, " - null");
    }
    else if (typeof propValue === 'string') {
      let input = Fluent.input('text')._handler('change', () => {
        this.backingObject[propName] = input.value; 
      });
      input.value = propValue;
      return Fluent.div()._append(
        propName + ` - ${propValue.constructor.name}`,
        input
      );
    }
    else if (typeof propValue === 'number') {
      let input = Fluent.input('number')._handler('change', () => {
        this.backingObject[propName] = Number(input.value);
      });
      input.value = propValue;
      return Fluent.div()._append(
        propName + ` - ${propValue.constructor.name}`,
        input
      );
    }
    else if (typeof propValue === 'object' && PropertyGrid.isEditorPrimitive(propValue)) {
      let editor = propValue.createEditor(Fluent);
      editor.setValue(propValue);
      return Fluent.div()._append(
        propName + ' - ' + `${propValue.constructor.name}`,
        editor.getElement()
      );
    }
    /*
    else if (Array.isArray(propValue)) {
      let index = 0;
      return Fluent.e('details')._style({marginLeft: '8px'})._append(
        Fluent.e('summary')._append(propName, ' - ', 'Collection'),
        ...this.backingObject[propName].map((p:any) => { let r = this.makePropDiv(`${index}`, p); index += 1; return r; })
      );
    }
    */
    else
      return Fluent.div()._append(propName, ' - ', typeof propValue, ': ', `${propValue}`);
  }
}
