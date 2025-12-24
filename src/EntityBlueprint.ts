import { Point } from "./Point.js";
import { type ComponentBlueprint } from "./ComponentFactory.js";

type EntityBlueprintPrototype = {
  pivot: Point;
  size: Point;
  components: object[];
}

export class EntityBlueprint {
  public pivot: Point;
  public size: Point;
  public components: ComponentBlueprint[];

  constructor(prototype?:object) {
    let p = prototype as EntityBlueprintPrototype;
    this.pivot = new Point(p?.pivot);
    this.size = new Point(p?.size);
    this.components = (p?.components ?? []).map(c => c as ComponentBlueprint);
  }
}

