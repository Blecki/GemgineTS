import { Point } from "./Point.js";
import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";

type AnimationAssetPrototype = {
  name: string;
  direction: string;
  frames: Point[];
}

export class AnimationAsset {
  public name: string;
  public direction: string;
  public frames: Point[];

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.frames ??= [];
    this.frames = this.frames.map(f => new Point(f));
  }

  constructor(prototype?:object) {
    let p = prototype as AnimationAssetPrototype;
    this.name = p?.name ?? "unnamed";
    this.direction = p?.direction ?? "north";
    this.frames = (p?.frames ?? []).map(f => new Point(f));
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

  public getAnimation(name: string, direction: string | undefined) : AnimationAsset | null {
    if (this.animations == undefined) return null;
    for (let a of this.animations)
      if (a.name == name && (direction == undefined || a.direction == direction)) return a;
    if (direction != undefined)
      return this.getAnimation(name, undefined);
    return null;
  }
}