export class ProcessedElement {
    public element: FluentElement | undefined = undefined;
}

export type FluentModificationCallback = (element: FluentElement) => void;
export type FluentHandler = () => void;

export interface ElementExtensions {
    _append(...args: any[]): FluentElement;
    _modify(callback: FluentModificationCallback): FluentElement;
    _class(class_name: string): FluentElement;
    _style(styles: any): FluentElement;
    _handler(type:string, func: FluentHandler): FluentElement;
    type: string;
    value: any;
}

export interface FluentElement extends HTMLElement, ElementExtensions {}

export class Fluent {
    e(type: string): FluentElement { return  this.createElement(type); }
    div(): FluentElement { return this.createElement('div'); }
    span(): FluentElement { return this.createElement('span'); }
    button(): FluentElement { return this.createElement('button')._modify(e => e.type = 'button'); }
    text(contents: string): FluentElement { return this.createElement('span')._append(`${contents}`); }
    input(type: string): FluentElement { return this.createElement('input') }
    table(): FluentElement { return this.createElement('table'); }
    thead(): FluentElement { return this.createElement('thead'); }
    th(): FluentElement { return this.createElement('th'); }
    tr(): FluentElement { return this.createElement('tr'); }
    td(): FluentElement { return this.createElement('td'); }
    tfoot(): FluentElement { return this.createElement('tfoot'); }
    tbody(): FluentElement { return this.createElement('tbody'); }
    html_div(html: string): FluentElement { let r = this.createElement('div'); r.innerHTML = html; return r; };
    
    createElement(type: string): FluentElement {
        let r = document.createElement(type);
        return this.addHooks(r);
    }

    addHooks(element: HTMLElement): FluentElement {
        // @ts-ignore
        element["_append"] = (...args: any[]) => {
            for (let child of args) {
                if (child === undefined) continue;
                if (typeof child === 'string' || child instanceof String)
                    element.appendChild(document.createTextNode(`${child}`));
                else
                    element.appendChild(child);
            }
            return element;
        };

        // @ts-ignore
        element["_modify"] = (callback: FluentModificationCallback) =>
        {
            callback(element as FluentElement);
            return element;
        };

        // @ts-ignore
        element["_class"] = (class_name: string) => {
            element.className = class_name;
            return element;
        };

        // @ts-ignore
        element["_style"] = (styles: any) => {
            for(var s in styles) {
                // @ts-ignore
                element.style[s] = styles[s];
            }
            return element;
        };

        // @ts-ignore
        element["_handler"] = (type: string, func: FluentHandler) => {
            element.addEventListener(type, func);
            return element;
        };

        return element as FluentElement;
    }
}
