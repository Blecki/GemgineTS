export class AnimationPlayer {
    frameCount;
    currentPlace;
    fps;
    loop;
    constructor(frameCount, fps, loop, currentPlace) {
        this.frameCount = frameCount;
        this.fps = fps;
        this.loop = loop;
        this.currentPlace = currentPlace;
    }
    reset(frameCount, fps, loop, currentPlace) {
        this.frameCount = frameCount;
        this.fps = fps;
        this.loop = loop;
        this.currentPlace = currentPlace;
    }
    advance(delta) {
        this.currentPlace += delta;
        if (this.loop) {
            while (this.currentPlace >= (this.frameCount * this.fps))
                this.currentPlace -= (this.frameCount * this.fps);
        }
    }
    getCurrentFrame() {
        let rawFrame = Math.floor(this.currentPlace / (1 / this.fps));
        if (this.loop)
            return rawFrame % this.frameCount;
        else if (rawFrame >= this.frameCount)
            return this.frameCount - 1;
        else
            return rawFrame;
    }
    isAtEnd() {
        if (this.loop)
            false;
        return this.getCurrentFrame() == this.frameCount - 1;
    }
}
//# sourceMappingURL=AnimationPlayer.js.map