type AnimationHitBoxPrototype = {
  x: number;
  y: number;
  width: number;
  height: number;
  type: string;
}

export class AnimationHitBox {
  public x: number;
  public y: number;
  public width: number;
  public height: number;
  public type: string;

  constructor(prototype?:object) {
    let p = prototype as AnimationHitBoxPrototype;
    this.x = p?.x ?? 0;
    this.y = p?.y ?? 0;
    this.width = p?.width ?? 1;
    this.height = p?.height ?? 1;
    this.type = p?.type ?? "hit";
  }  
}
