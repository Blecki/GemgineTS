import { Point } from "./Point.js";

/**
 * Calculates a single point on a cubic Bézier curve for a given t value.
 * @param t The time parameter, typically between 0 and 1.
 * @param p0 The start control point.
 * @param p1 The first control point.
 * @param p2 The second control point.
 * @param p3 The end control point.
 * @returns The point on the curve at time t.
 */
export function calculateBezierPoint(t: number, p0: Point, p1: Point, p2: Point, p3: Point): Point {
    const u = 1 - t;
    const tt = t * t;
    const uu = u * u;
    const uuu = uu * u;
    const ttt = tt * t;

    // The cubic Bézier formula: B(t) = (1-t)^3 * P0 + 3 * (1-t)^2 * t * P1 + 3 * (1-t) * t^2 * P2 + t^3 * P3
    const x = uuu * p0.x + 3 * uu * t * p1.x + 3 * u * tt * p2.x + ttt * p3.x;
    const y = uuu * p0.y + 3 * uu * t * p1.y + 3 * u * tt * p2.y + ttt * p3.y;

    return new Point(x, y);
}

/**
 * Generates a series of points along a cubic Bézier curve.
 * @param p0 The start control point.
 * @param p1 The first control point.
 * @param p2 The second control point.
 * @param p3 The end control point.
 * @param numPoints The number of points to generate along the curve (higher for smoother results).
 * @returns An array of Points along the curve.
 */
export function generateBezierPoints(p0: Point, p1: Point, p2: Point, p3: Point, numPoints: number): Point[] {
    const points: Point[] = [];
    // Ensure we have at least 2 points (start and end)
    if (numPoints < 2) {
        points.push(p0, p3);
        return points;
    }

    // Iterate from t = 0 to t = 1 to get points
    for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1);
        const point = calculateBezierPoint(t, p0, p1, p2, p3);
        points.push(point);
    }

    return points;
}
