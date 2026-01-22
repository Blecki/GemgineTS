import { AssetReference } from "./AssetReference.js";
import { AssetStore } from "./AssetStore.js";
import pathCombine from "./PathCombine.js";
import { Point } from "./Point.js";

type TiledPropertyPrototype = {
  name: string;
  type: string;
  value: string;
}

export class TiledProperty {
  public name: string;
  public type: string;
  public value: string;

  constructor(prototype?:object) {
    let p = prototype as TiledPropertyPrototype;
    this.name = p?.name ?? "";
    this.type = p?.type ?? "";
    this.value = p?.value ?? "";
  }
}

type TiledObjectPrototype = {
  gid: number;
  height: number;
  id: number;
  name: string;
  polygon: object[];
  properties: object[];
  rotation: number;
  template: string;
  type: string;
  visible: boolean;
  width: number;
  x: number;
  y: number;
}

export class TiledObject {
  public gid: number;
  public height: number;
  public id: number;
  public name: string;
  public polygon: Point[];
  public properties: TiledProperty[];
  public rotation: number;
  public template: string;
  public type: string;
  public visible: boolean;
  public width: number;
  public x: number;
  public y: number;

  public templateAsset: AssetReference | undefined;

  constructor(prototype?:object) {
    let p = prototype as TiledObjectPrototype;
    this.gid = p?.gid ?? -1;
    this.height = p?.height ?? 1;
    this.id = p?.id ?? -1;
    this.name = p?.name ?? "";
    this.polygon = (p?.polygon ?? []).map(p => new Point(p));
    this.properties = (p?.properties ?? []).map(p => new TiledProperty(p));
    this.rotation = p?.rotation ?? 0;
    this.template = p?.template ?? "";
    this.type = p?.type ?? "";
    this.visible = p?.visible ?? true;
    this.width = p?.width ?? 1;
    this.x = p?.x ?? 0;
    this.y = p?.y ?? 0;
  }

  public resolveDependencies(self: AssetReference, engine: AssetStore) {
    if (this.template != null && this.template != "")
      this.templateAsset = engine.assetMap.get(pathCombine(self.directory(), this.template));
  }
}
