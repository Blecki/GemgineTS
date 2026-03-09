export class TilingPerlin {
  private p: Uint8Array;

  constructor() {
    this.p = new Uint8Array(512);
    const permutation = new Uint8Array(256);
    for (let i = 0; i < 256; i++) permutation[i] = i;
    // Shuffle permutation table
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [permutation[i], permutation[j]] = [permutation[j], permutation[i]];
    }
    // Duplicate for lookup efficiency
    for (let i = 0; i < 512; i++) this.p[i] = permutation[i & 255];
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    // Convert low 3 bits of hash code into 8 gradient directions
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  public get(x: number, y: number, scale: number, period: number): number {
    x *= scale;
    y *= scale;

    x %= period;
    y %= period;

    const xi = Math.floor(x);
    const yi = Math.floor(y);

    const xf = x - Math.floor(x);
    const yf = y - Math.floor(y);
    
    const u = this.fade(xf);
    const v = this.fade(yf);

    // Hash coordinates of the 4 square corners
    const a = this.p[xi] + yi;
    const b = this.p[(xi + 1) % period] + yi;

    const aa = this.p[this.p[xi] + yi];
    const ab = this.p[this.p[xi] + ((yi + 1) % period)];
    const ba = this.p[this.p[(xi + 1) % period] + yi];
    const bb = this.p[this.p[(xi + 1) % period] + ((yi + 1) % period)];

    // Interpolate gradients
    return this.lerp(v,
      this.lerp(u, this.grad(this.p[aa], xf, yf), this.grad(this.p[ba], xf - 1, yf)),
      this.lerp(u, this.grad(this.p[ab], xf, yf - 1), this.grad(this.p[bb], xf - 1, yf - 1))
    );
  }
}