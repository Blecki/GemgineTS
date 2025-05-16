export class GameTime {
    private static lastTime: number = performance.now();
    private static deltaTime: number = 0;

    static update() {
        const currentTime = performance.now();
        this.deltaTime = (currentTime - this.lastTime) / 1000; // Convert milliseconds to seconds
        this.lastTime = currentTime;
    }

    static getDeltaTime(): number {
        return this.deltaTime;
    }
}