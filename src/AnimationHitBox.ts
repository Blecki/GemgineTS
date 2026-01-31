import { Rect } from "./Rect.js";

type AnimationHitBoxPrototype = {
  type: string;
}

export class AnimationHitBox extends Rect {
  public type: string;

  constructor(prototype?:object) {
    super(prototype);
    let p = prototype as AnimationHitBoxPrototype;
    this.type = p?.type ?? "hit";
  }  
}
