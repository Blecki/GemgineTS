export class GameTime {
    static lastTime = performance.now();
    static deltaTime = 0;
    static update() {
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert milliseconds to seconds
        this.lastTime = currentTime;
    }
    static getDeltaTime() {
        return this.deltaTime;
    }
}
//# sourceMappingURL=GameTime.js.map