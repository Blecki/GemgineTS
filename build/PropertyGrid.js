import { Fluent } from "./Fluent.js";
export class PropertyGrid {
    backingObject;
    element = undefined;
    f = undefined;
    propertyMap;
    constructor(backingObject) {
        this.backingObject = backingObject;
        this.backingObject.__gemginePropertyGrid = this;
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
            this.f = new Fluent();
            this.element = this.f.e('details');
            this.element._append(this.f.e('summary')._append(`${this.backingObject.constructor.name}`));
            this.propertyMap = {};
            for (var propName in this.backingObject) {
                let propDiv = null;
                if (Array.isArray(this.backingObject[propName])) {
                }
                else if (typeof this.backingObject[propName] === 'object') {
                    if (this.backingObject[propName] == null) {
                        propDiv = this.f.div()._append(propName, "null");
                    }
                    else {
                        propDiv = this.f.div()._append(propName, (new PropertyGrid(this.backingObject[propName])).getElement());
                    }
                }
                else
                    propDiv = this.f.div()._append(propName, typeof this.backingObject[propName]);
                this.propertyMap[propName] = propDiv;
                this.element._append(propDiv);
            }
        }
    }
}
//# sourceMappingURL=PropertyGrid.js.map