import { Color } from "./Color.js";

export interface GradientPoint {
  duration: number; // 0.0 to 1.0
  color: Color;
}

export class Gradient {
  private points: GradientPoint[];

  constructor(points: GradientPoint[]) {
    this.points = points.sort((a, b) => a.duration - b.duration);
  }

  public getColorAt(t: number): Color {
    if (this.points.length === 0) return Color.Black;
    
    t = Math.max(0, Math.min(1, t));

    if (t <= this.points[0].duration) return this.points[0].color;
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
}