export class Random {
    seed;
    constructor(seed) {
        this.seed = seed;
    }
    NextFloat() {
        let x = Math.sin(this.seed++) * 10000;
        return x - Math.floor(x);
    }
    NextInt(min, max) {
        return Math.floor(this.NextFloat() * (max - min + 1)) + min;
    }
}
//# sourceMappingURL=Random.js.map