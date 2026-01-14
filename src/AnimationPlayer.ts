export class AnimationPlayer {
  public frameCount: number;
  public currentPlace: number;
  public fps: number;
  public loop: boolean;

  constructor(frameCount: number, fps: number, loop: boolean, currentPlace: number) {
    this.frameCount = frameCount;
    this.fps = fps;
    this.loop = loop;
    this.currentPlace = currentPlace;
  }

  public reset(frameCount: number, fps: number, loop: boolean, currentPlace: number) {
    this.frameCount = frameCount;
    this.fps = fps;
    this.loop = loop;
    this.currentPlace = currentPlace;
  }

  public advance(delta: number) {
    this.currentPlace += delta;
    if (this.loop) {
      while (this.currentPlace >= (this.frameCount * this.fps))
        this.currentPlace -= (this.frameCount * this.fps);
    }
  }

  public getCurrentFrame() {
    let rawFrame = Math.floor(this.currentPlace / (1 / this.fps));
    if (this.loop) return rawFrame % this.frameCount;
    else if (rawFrame >= this.frameCount) return this.frameCount - 1;
    else return rawFrame;
  }

  public isAtEnd() {
    if (this.loop) false;
    return this.getCurrentFrame() == this.frameCount - 1;
  }
}