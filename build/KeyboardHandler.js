export class KeyState {
    key;
    code;
    shift;
    ctrl;
    alt;
    constructor(key, code, shift, ctrl, alt) {
        this.key = key;
        this.code = code;
        this.shift = shift;
        this.ctrl = ctrl;
        this.alt = alt;
    }
}
export class KeyboardHandler {
    keyQueue = [];
    activeKeys = new Set();
    constructor(element = window) {
        // Note: TabIndex is required on Canvas if listening to the element directly
        element.addEventListener('keydown', (e) => {
            const state = new KeyState(e.key, e.code, e.shiftKey, e.ctrlKey, e.altKey);
            this.keyQueue.push(state);
            this.activeKeys.add(e.code);
            // Prevent scrolling/browser shortcuts if needed
            // e.preventDefault(); 
        });
        element.addEventListener('keyup', (e) => {
            this.activeKeys.delete(e.code);
        });
    }
    consumeEvents() {
        const events = [...this.keyQueue];
        this.keyQueue = [];
        return events;
    }
    isKeyDown(code) {
        return this.activeKeys.has(code);
    }
}
//# sourceMappingURL=KeyboardHandler.js.map