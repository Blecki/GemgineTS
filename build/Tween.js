import { GameTime } from "./GameTime.js";
import { Point } from "./Point.js";
export class TweenNumber {
    start;
    end;
    time;
    constructor(start, end, time) {
        this.start = start;
        this.end = end;
        this.time = time;
    }
    progress = 0;
    update() {
        this.progress += GameTime.getDeltaTime();
        return this.value;
    }
    get value() {
        return this.start + ((this.end - this.start) * (this.progress / this.time));
    }
}
export class TweenPoint {
    start;
    end;
    time;
    constructor(start, end, time) {
        this.start = start;
        this.end = end;
        this.time = time;
    }
    progress = 0;
    update() {
        this.progress += GameTime.getDeltaTime();
        return this.value;
    }
    get value() {
        let delta = this.end.sub(this.start);
        let t = this.progress / this.time;
        return this.start.add(delta.multiply(t));
    }
}
//# sourceMappingURL=Tween.js.map