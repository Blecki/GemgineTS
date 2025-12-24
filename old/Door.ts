import { Point } from "./Point.js";
import { Room } from "./Room.js";
import { Random } from "./Random.js";

export class Door {
  public tile: Point;
  public direction: string;
  public neighbor: Room;
  public locked: number = 0;
  public pixelAnchor: Point;
  public internalConnections: boolean[] = [];

  constructor(tile: Point, direction: string, neighbor: Room) {
    this.tile = tile;
    this.direction = direction;
    this.neighbor = neighbor;
    this.pixelAnchor = new Point(0, 0);
  }
  
  static createVerticalDoor(first: Room, second: Room, random: Random) {
    let min = Math.trunc(Math.max(first.rect.x, second.rect.x));
    let max = Math.trunc(Math.min(first.rect.x + first.rect.width - 1, second.rect.x + second.rect.width - 1));
    let spot = random.NextInt(min, max);
    first.doors.push(new Door(new Point(Math.trunc(spot - first.rect.x), 0), "north", second));
    second.doors.push(new Door(new Point(Math.trunc(spot - second.rect.x), second.rect.height - 1), "south", first));
  }  
  
  static createHorizontalDoor(first: Room, second: Room, random: Random) {
    let min = Math.trunc(Math.max(first.rect.y, second.rect.y));
    let max = Math.trunc(Math.min(first.rect.y + first.rect.height - 1, second.rect.y + second.rect.height - 1));
    let spot = random.NextInt(min, max);
    first.doors.push(new Door(new Point(0, Math.trunc(spot - first.rect.y)), "west", second));
    second.doors.push(new Door(new Point(second.rect.width - 1, Math.trunc(spot - second.rect.y)), "east", first));
  }

  setupDoorPathing(doorCount: number) {
    for (let x = 0; x < doorCount; ++x) 
      this.internalConnections.push(true);
  }
}