export class ProcessedElement {
    public element: FluentElement | undefined = undefined;
}

export type FluentModificationCallback = (element: FluentElement) => void;
export type FluentHandler = (e?: any) => void;

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
    public static e(type: string): FluentElement { return  Fluent.createElement(type); }
    public static div(): FluentElement { return Fluent.createElement('div'); }
    public static span(): FluentElement { return Fluent.createElement('span'); }
    public static button(): FluentElement { return Fluent.createElement('button')._modify(e => e.type = 'button'); }
    public static text(contents: string): FluentElement { return Fluent.createElement('span')._append(`${contents}`); }
    public static input(type: string): FluentElement { return Fluent.createElement('input')._modify(f => f.type = type); }
    public static table(): FluentElement { return Fluent.createElement('table'); }
    public static thead(): FluentElement { return Fluent.createElement('thead'); }
    public static th(): FluentElement { return Fluent.createElement('th'); }
    public static tr(): FluentElement { return Fluent.createElement('tr'); }
    public static td(): FluentElement { return Fluent.createElement('td'); }
    public static tfoot(): FluentElement { return Fluent.createElement('tfoot'); }
    public static tbody(): FluentElement { return Fluent.createElement('tbody'); }
    public static html_div(html: string): FluentElement { let r = Fluent.createElement('div'); r.innerHTML = html; return r; };
    
    public static createElement(type: string): FluentElement {
        let r = document.createElement(type);
        return Fluent.addHooks(r);
    }

    public static addHooks(element: HTMLElement): FluentElement {
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
