import { Color } from "./Color.js";
export class GradientPoint {
    duration; // 0.0 to 1.0
    color;
    constructor(first, second) {
        if (first === undefined) {
            this.duration = 0;
            this.color = new Color(0, 0, 0, 1);
        }
        else if (typeof first === 'number') {
            this.duration = first;
            this.color = second ?? new Color(0, 0, 0, 1);
        }
        else {
            let prototype = first;
            this.duration = prototype.DURATION;
            this.color = new Color(prototype.COLOR);
        }
    }
}
export class Gradient {
    points;
    constructor(first) {
        if (first === undefined) {
            this.points = [];
        }
        else if (Array.isArray(first)) {
            this.points = first.sort((a, b) => a.duration - b.duration);
        }
        else {
            let prototype = first;
            this.points = prototype.POINTS.map(p => new GradientPoint(p)).sort((a, b) => a.duration - b.duration);
        }
    }
    getColorAt(t) {
        if (this.points.length === 0)
            return Color.Black;
        t = Math.max(0, Math.min(1, t));
        if (t <= this.points[0].duration)
            return this.points[0].color;
        if (t >= this.points[this.points.length - 1].duration)
            return this.points[this.points.length - 1].color;
        for (let i = 0; i < this.points.length - 1; i++) {
            let start = this.points[i];
            let end = this.points[i + 1];
            if (t >= start.duration && t <= end.duration) {
                let localT = (t - start.duration) / (end.duration - start.duration); // UI should prevent creating two points at the same duration
                return Color.lerp(start.color, end.color, localT);
            }
        }
        return this.points[this.points.length - 1].color;
    }
    sortPoints() {
        this.points.sort((a, b) => a.duration - b.duration);
    }
}
//# sourceMappingURL=Gradient.js.map