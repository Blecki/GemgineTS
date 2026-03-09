import { Point } from "./Point.js";
import { Color } from "./Color.js";
import { Gradient } from "./Gradient.js";

export class LinearGradient {
  public start: Point;
  public end: Point;
  public gradient: Gradient;

  constructor(start: Point, end: Point, gradient: Gradient) {
    this.start = start;
    this.end = end;
    this.gradient = gradient;
  }

  /**
   * Returns the color at a specific UV coordinate based on the line's projection.
   * @param uv The point in UV space (0-1) to sample.
   */
  public getColorAtUV(uv: Point): Color {
    // 1. Create vectors: Line (AB) and Point (AP)
    const ab = new Point(this.end.x - this.start.x, this.end.y - this.start.y);
    const ap = new Point(uv.x - this.start.x, uv.y - this.start.y);

    // 2. Project AP onto AB using the dot product formula:
    // t = (AP ⋅ AB) / |AB|²
    const dotAP_AB = (ap.x * ab.x) + (ap.y * ab.y);
    const magSquaredAB = (ab.x * ab.x) + (ab.y * ab.y);

    if (magSquaredAB === 0) return this.gradient.getColorAt(0);

    const t = dotAP_AB / magSquaredAB;

    // 3. Sample the gradient at the calculated duration 't'
    return this.gradient.getColorAt(t);
  }
}