export class ProcessedElement {
    element = undefined;
}
export class Fluent {
    static e(type) { return Fluent.createElement(type); }
    static div() { return Fluent.createElement('div'); }
    static span() { return Fluent.createElement('span'); }
    static button() { return Fluent.createElement('button')._modify(e => e.type = 'button'); }
    static text(contents) { return Fluent.createElement('span')._append(`${contents}`); }
    static input(type) { return Fluent.createElement('input')._modify(f => f.type = type); }
    static table() { return Fluent.createElement('table'); }
    static thead() { return Fluent.createElement('thead'); }
    static th() { return Fluent.createElement('th'); }
    static tr() { return Fluent.createElement('tr'); }
    static td() { return Fluent.createElement('td'); }
    static tfoot() { return Fluent.createElement('tfoot'); }
    static tbody() { return Fluent.createElement('tbody'); }
    static html_div(html) { let r = Fluent.createElement('div'); r.innerHTML = html; return r; }
    ;
    static createElement(type) {
        let r = document.createElement(type);
        return Fluent.addHooks(r);
    }
    static addHooks(element) {
        // @ts-ignore
        element["_append"] = (...args) => {
            for (let child of args) {
                if (child === undefined)
                    continue;
                if (typeof child === 'string' || child instanceof String)
                    element.appendChild(document.createTextNode(`${child}`));
                else
                    element.appendChild(child);
            }
            return element;
        };
        // @ts-ignore
        element["_modify"] = (callback) => {
            callback(element);
            return element;
        };
        // @ts-ignore
        element["_class"] = (class_name) => {
            element.className = class_name;
            return element;
        };
        // @ts-ignore
        element["_style"] = (styles) => {
            for (var s in styles) {
                // @ts-ignore
                element.style[s] = styles[s];
            }
            return element;
        };
        // @ts-ignore
        element["_handler"] = (type, func) => {
            element.addEventListener(type, func);
            return element;
        };
        return element;
    }
}
//# sourceMappingURL=Fluent.js.map