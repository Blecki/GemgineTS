import { Point } from "./Point.js";
import { AssetReference } from "./AssetReference.js";
import { Engine } from "./Engine.js";
import { initializeFromJSON } from "./JsonConverter.js";

export class AnimationAsset {
  public name: string | undefined = undefined;
  public direction: string | undefined = undefined;
  public frames: Point[] | undefined = [];

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.frames ??= [];
    this.frames = this.frames.map(f => initializeFromJSON(f, new Point(0,0)));
  }
}

export class AnimationSetAsset {
  public animations: AnimationAsset[] | undefined = [];

  public resolveDependencies(self: AssetReference, engine: Engine) {
    this.animations ??= [];
    this.animations = this.animations.map(a => initializeFromJSON(a, new AnimationAsset()));
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