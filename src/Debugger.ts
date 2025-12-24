import { Fluent, type FluentElement } from "./Fluent.js";


export interface DebuggableObject {
  createDebugger(name: string): FluentElement;
}

export class Debugger {
  private container: HTMLElement;

  public static isDebuggableObject(object: any): object is DebuggableObject {
    return 'createDebugger' in object;
  }

  public constructor(container: HTMLElement) {
    this.container = container;
  }

  public debugObject(object: DebuggableObject) {
    this.container.innerHTML = "";
    this.container.appendChild(object.createDebugger(""));
  }  
}

export class PropertyGrid {
  public backingObject: any;
  public objectName: string;
  public element: FluentElement | undefined = undefined;
  f: Fluent;
  properties: string[];

  public constructor(backingObject: any, objectName: string, properties: string[]) {
    this.backingObject = backingObject;
    this.objectName = objectName;
    this.properties = properties;
    this.f = new Fluent();
    this.refresh();
  }

  public getElement(): FluentElement {
    if (this.element == undefined)
      this.refresh();
    // @ts-ignore
    return this.element;
  }

  public refresh() {
    if (this.element == undefined) {
      this.element = this.f.e('details');
      this.element._append(this.f.e('summary')._append(this.objectName, ' - ', `${this.backingObject.constructor.name}`));

      for (var propName of this.properties) {
        let propDiv = this.makePropDiv(propName, this.backingObject[propName]);
        propDiv?._style({border: "1px solid black", marginLeft: "8px"});
        this.element._append(propDiv);
      }
    }
  }

  private makePropDiv(propName: string, propValue: any): FluentElement {
    if (propValue == null) {
      return this.f.div()._append(propName, " - null");
    }
    else if (typeof propValue === 'object' && Debugger.isDebuggableObject(propValue)) {
      return this.f.div()._append(propValue.createDebugger(propName));
    }
    else if (Array.isArray(propValue)) {
      let index = 0;
      return this.f.e('details')._style({marginLeft: '8px'})._append(
        this.f.e('summary')._append(propName, ' - ', 'Collection'),
        ...this.backingObject[propName].map((p:any) => { let r = this.makePropDiv(`${index}`, p); index += 1; return r; })
      );
    }
    else
      return this.f.div()._append(propName, ' - ', typeof propValue, ': ', `${propValue}`);
  }
}
