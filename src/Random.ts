export class Random {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  NextFloat(): number {
    let x = Math.sin(this.seed++) * 10000;
    return x - Math.floor(x);
  }

  NextInt(min: number, max: number): number {
    return Math.floor(this.NextFloat() * (max - min + 1)) + min;
  }
}
