import { Point } from "./Point.js";
import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";

type AnimationAssetPrototype = {
  name: string;
  direction: string;
  frames: Point[];
  fps: number;
}

export class AnimationAsset {
  public name: string;
  public frames: Point[];
  public fps: number;

  public resolveDependencies(self: AssetReference, engine: Engine) {
  }

  constructor(prototype?:object) {
    let p = prototype as AnimationAssetPrototype;
    this.name = p?.name ?? "unnamed";
    this.frames = (p?.frames ?? []).map(f => new Point(f));
    this.fps = p?.fps ?? 10;
  }
}

type AnimationSetAssetPrototype = {
  animations: AnimationAssetPrototype[];
}

export class AnimationSetAsset {
  public animations: AnimationAsset[];
  
  constructor(prototype?:object) {
    let p = prototype as AnimationSetAssetPrototype;
    this.animations = (p?.animations ?? []).map(a => new AnimationAsset(a));
  }

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.animations ??= [];
    this.animations = this.animations.map(a => new AnimationAsset(a));
    this.animations.forEach(a => a.resolveDependencies(self, engine));
  }

  public getAnimation(name: string) : AnimationAsset | null {
    if (this.animations == undefined) return null;
    for (let a of this.animations)
      if (a.name == name) return a;
    return null;
  }
}