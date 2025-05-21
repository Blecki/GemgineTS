import { Entity } from "./Entity.js";
import { Rect } from "./Rect.js";

export class QuadTree {
  public readonly boundary: Rect;
  public readonly leafLimit: number;
  public readonly minimumLeafArea: number;
  public leaves: QuadTree[];
  private items: Entity[] = [];

  constructor(boundary: Rect, leafLimit: number, minimumLeafArea: number, items: Entity[]) {
    this.boundary = boundary;
    this.leafLimit = leafLimit;
    this.minimumLeafArea = minimumLeafArea;
    this.leaves = null;

    for (let item of items)
      this.insert(item);
  }

  public insert(point: Entity): void {
    if (this.boundary.overlaps(point.globalBounds)) {
      if (this.leaves != null)
        for (let leaf of this.leaves) leaf.insert(point);
      else if (this.items.length < this.leafLimit || this.boundary.area <= this.minimumLeafArea) {
        this.items.push(point);
        point.storageNode = this;
      }
      else {
        this.subdivide();
        for (let leaf of this.leaves) leaf.insert(point);
      }
    }
  }

  private subdivide(): void {
    const x = this.boundary.x;
    const y = this.boundary.y;
    const w = this.boundary.width / 2;
    const h = this.boundary.height / 2;

    this.leaves = [
      new QuadTree(new Rect(x + w, y, w, h), this.leafLimit, this.minimumLeafArea, this.items),
      new QuadTree(new Rect(x, y, w, h), this.leafLimit, this.minimumLeafArea, this.items),
      new QuadTree(new Rect(x + w, y + h, w, h), this.leafLimit, this.minimumLeafArea, this.items),
      new QuadTree(new Rect(x, y + h, w, h), this.leafLimit, this.minimumLeafArea, this.items)
    ];

    this.items = [];
  }


}