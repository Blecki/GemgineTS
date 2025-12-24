export class ProcessedElement {
    element = undefined;
}
export class Fluent {
    e(type) { return this.createElement(type); }
    div() { return this.createElement('div'); }
    span() { return this.createElement('span'); }
    button() { return this.createElement('button')._modify(e => e.type = 'button'); }
    text(contents) { return this.createElement('span')._append(`${contents}`); }
    input(type) { return this.createElement('input'); }
    table() { return this.createElement('table'); }
    thead() { return this.createElement('thead'); }
    th() { return this.createElement('th'); }
    tr() { return this.createElement('tr'); }
    td() { return this.createElement('td'); }
    tfoot() { return this.createElement('tfoot'); }
    tbody() { return this.createElement('tbody'); }
    html_div(html) { let r = this.createElement('div'); r.innerHTML = html; return r; }
    ;
    createElement(type) {
        let r = document.createElement(type);
        return this.addHooks(r);
    }
    addHooks(element) {
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