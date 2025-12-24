import { Fluent } from "./Fluent.js";
export class Debugger {
    container;
    static isDebuggableObject(object) {
        return 'createDebugger' in object;
    }
    constructor(container) {
        this.container = container;
    }
    debugObject(object) {
        this.container.innerHTML = "";
        this.container.appendChild(object.createDebugger(""));
    }
}
export class PropertyGrid {
    backingObject;
    objectName;
    element = undefined;
    f;
    properties;
    constructor(backingObject, objectName, properties) {
        this.backingObject = backingObject;
        this.objectName = objectName;
        this.properties = properties;
        this.f = new Fluent();
        this.refresh();
    }
    getElement() {
        if (this.element == undefined)
            this.refresh();
        // @ts-ignore
        return this.element;
    }
    refresh() {
        if (this.element == undefined) {
            this.element = this.f.e('details');
            this.element._append(this.f.e('summary')._append(this.objectName, ' - ', `${this.backingObject.constructor.name}`));
            for (var propName of this.properties) {
                let propDiv = this.makePropDiv(propName, this.backingObject[propName]);
                propDiv?._style({ border: "1px solid black", marginLeft: "8px" });
                this.element._append(propDiv);
            }
        }
    }
    makePropDiv(propName, propValue) {
        if (propValue == null) {
            return this.f.div()._append(propName, " - null");
        }
        else if (typeof propValue === 'object' && Debugger.isDebuggableObject(propValue)) {
            return this.f.div()._append(propValue.createDebugger(propName));
        }
        else if (Array.isArray(propValue)) {
            let index = 0;
            return this.f.e('details')._style({ marginLeft: '8px' })._append(this.f.e('summary')._append(propName, ' - ', 'Collection'), ...this.backingObject[propName].map((p) => { let r = this.makePropDiv(`${index}`, p); index += 1; return r; }));
        }
        else
            return this.f.div()._append(propName, ' - ', typeof propValue, ': ', `${propValue}`);
    }
}
//# sourceMappingURL=Debugger.js.map