import { AnimationHitBox } from "./AnimationHitBox.js";

type AnimationFramePrototype = {
  x: number;
  y: number;
  hitBoxes: AnimationHitBox[];
}

export class AnimationFrame {
  public x: number;
  public y: number;
  public hitBoxes: AnimationHitBox[];

  constructor(prototype?:object) {
    let p = prototype as AnimationFramePrototype;
    this.x = p?.x ?? 0;
    this.y = p?.y ?? 0;
    this.hitBoxes = (p?.hitBoxes ?? []).map(f => new AnimationHitBox(f));
  }
}