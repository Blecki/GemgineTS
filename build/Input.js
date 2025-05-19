export class Input {
    inputEvents = [];
    maxHistoryTime = 5_000; // milliseconds
    actionMap = {};
    initialize() {
        window.addEventListener('keydown', function (e) {
            const action = this.actionMap[e.code];
            if (!action)
                return;
            // Don't duplicate if already down
            const existing = this.inputEvents.find(ev => ev.action === action && ev.pressed);
            if (!existing) {
                this.inputEvents.push({
                    action,
                    pressed: true,
                    downTime: performance.now(),
                    upTime: null,
                    handled: false,
                });
            }
        }.bind(this));
        window.addEventListener('keyup', function (e) {
            const action = this.actionMap[e.code];
            if (!action)
                return;
            const existing = this.inputEvents.find(ev => ev.action === action && ev.pressed);
            if (existing) {
                existing.pressed = false;
                existing.upTime = performance.now();
            }
        }.bind(this));
    }
    bind(key, action) {
        this.actionMap[key] = action;
    }
    /**
     * Looks for an unhandled input event for the given action within the last `withinMs` milliseconds.
     */
    tryGetRecentInput(action, withinMs) {
        const now = performance.now();
        for (const ev of this.inputEvents) {
            if (ev.action === action && !ev.handled && ((now - ev.downTime <= withinMs) || (!ev.pressed && ev.upTime && now - ev.upTime <= withinMs))) {
                return ev;
            }
        }
        return null;
    }
    check(action) {
        let input = this.tryGetRecentInput(action, 500);
        if (input != null) {
            this.markHandled(input);
            return true;
        }
    }
    /**
     * Marks a specific input event as handled.
     */
    markHandled(event) {
        event.handled = true;
    }
    /**
     * Removes old events from the input history.
     */
    cleanup() {
        const now = performance.now();
        for (let i = this.inputEvents.length - 1; i >= 0; i--) {
            const ev = this.inputEvents[i];
            if (ev.pressed)
                continue;
            const eventAge = now - ev.upTime;
            if (eventAge > this.maxHistoryTime) {
                this.inputEvents.splice(i, 1);
            }
        }
    }
}
//# sourceMappingURL=Input.js.map