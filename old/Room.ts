import { Rect } from "./Rect.js";
import { Color } from "./Color.js";
import { Door } from "./Door.js";
import { Point } from "./Point.js";
import { RawImage } from "./RawImage.js";

//All possible room sizes
/*
 1 1
 1 2
 1 3
 2 1
 2 2
 2 3
 3 1
 3 2
 3 3
*/

interface SearchNode {
    enteredRoom: Room;
    doorUsed: number;
};

export class Room {
  public rect: Rect = new Rect(0,0,1,1);
  public image: ImageBitmap | null = null;
  public doors: Door[] = [];
  public label: string = "";
  public doorLimit: number = -1;
  public branch: number = 0;
  public color: Color = {r: 255, g: 255, b: 255, a: 255};

  
  constructor(w: number, h: number) {
    this.rect = new Rect(0, 0, w, h);
  }

  getReturnDoor(neighbor: Room): Door | undefined {
    return this.doors.find(d => d.neighbor === neighbor);
  }

  getReturnDoorIndex(neighbor: Room): number {
    return this.doors.findIndex(d => d.neighbor === neighbor);
  }

  deleteReturnDoor(neighbor: Room) {
    this.doors = this.doors.filter(d => d.neighbor !== neighbor);
  }

  render(cellSize: Point): ImageBitmap {
    let testImage = RawImage.createBlank(this.rect.width * cellSize.x, this.rect.height * cellSize.y);
    testImage.fillWithColor(this.color);
    let darker = { r: this.color.r - 32, g: this.color.g - 32, b: this.color.b - 32, a: 255 };
    testImage.fillColorRect(new Rect(0, 0, 1, testImage.height), darker);
    testImage.fillColorRect(new Rect(testImage.width - 1, 0, 1, testImage.height), darker);
    testImage.fillColorRect(new Rect(0, 0, testImage.width, 1), darker);
    testImage.fillColorRect(new Rect(0, testImage.height - 1, testImage.width, 1), darker);
  
    this.doors.forEach(d => {
      let doorPos = new Point(Math.trunc(d.tile.x) * cellSize.x, Math.trunc(d.tile.y) * cellSize.y);
      let doorSize = new Point(1, 1);
      let doorColor = {r: 0, g: 0, b: 0, a: 255};
      if (d.locked == 1) doorColor = {r: 255, g: 255, b: 255, a: 255};
      if (d.locked == 2) doorColor = {r: 255, g: 0, b: 0, a: 255};
      if (d.direction == "north") { doorPos.x += Math.trunc(cellSize.x / 2) - 1; doorSize.x = 2; doorSize.y = 1; }
      if (d.direction == "south") { doorPos.x += Math.trunc(cellSize.x / 2) - 1; doorPos.y += cellSize.y - 1; doorSize.x = 2; doorSize.y = 1; }
      if (d.direction == "west") { doorPos.y += Math.trunc(cellSize.y / 2) - 1; doorSize.x = 1; doorSize.y = 2; }
      if (d.direction == "east") { doorPos.y += Math.trunc(cellSize.y / 2) - 1; doorPos.x += cellSize.x - 1; doorSize.x = 1; doorSize.y = 2; }
      
      doorPos.x = Math.trunc(doorPos.x);
      doorPos.y = Math.trunc(doorPos.y);
      testImage.fillColorRect(new Rect(doorPos.x, doorPos.y, doorSize.x, doorSize.y), doorColor);
      d.pixelAnchor = doorPos;
    });
    return testImage.toImageBitmap();
  }

  setupDoorPathing() {
    this.doors.forEach(d => d.setupDoorPathing(this.doors.length));
  }  

  static canReachPeerDoor(room: Room, exitUsed: number, entranceUsed: number) {
    let visited: SearchNode[] = [];
    let queue: SearchNode[] = [];

    let step1 = room.doors[exitUsed].neighbor;
    let step1rdoor = step1.getReturnDoor(room);
    if (step1rdoor == undefined) return false;
    let step1rdoorIndex = step1.doors.indexOf(step1rdoor);

    queue.push({enteredRoom: step1, doorUsed: step1rdoorIndex});
    visited.push({enteredRoom: step1, doorUsed: step1rdoorIndex});
    
    while (queue.length > 0) {
      let current = queue.shift();
      if (current == undefined) continue;
      // Enumerate only the doors actually reachable from this one
      for (let d = 0; d < current.enteredRoom.doors.length; ++d) {
        if (current.doorUsed == d) continue; // Can't go back through the door we arrived by.
        if (current.doorUsed != -1)
          if (!current.enteredRoom.doors[current.doorUsed].internalConnections[d]) continue;
        let neighbor = current.enteredRoom.doors[d].neighbor;
        let reverseDoor = neighbor.getReturnDoor(current.enteredRoom);
        if (reverseDoor == undefined) continue;
        let rdoorIndex = neighbor.doors.indexOf(reverseDoor);
        if (neighbor === room && rdoorIndex === entranceUsed) return true;
        if (!visited.some(v => v.enteredRoom === neighbor && v.doorUsed === rdoorIndex)) {
          visited.push({enteredRoom: neighbor, doorUsed: rdoorIndex});
          queue.push({enteredRoom: neighbor, doorUsed: rdoorIndex});
        }
      }
    }
    return false;
  }

  optimizeDoors() {
    for (let d1 = 0; d1 < this.doors.length; ++d1) {
      for (let d2 = 0; d2 < this.doors.length; ++d2) {
        if (d1 == d2) continue;
        if (!this.doors[d1].internalConnections[d2]) continue; // Connection is already broken, ignore.
        // If we can get to a door... other than ourselves... that is connected to d2... then we can eliminate the connection!
        for (let d3 = 0; d3 < this.doors.length; ++d3) {
          if (d3 == d1) continue;
          if ((d2 == d3 || this.doors[d2].internalConnections[d3]) && Room.canReachPeerDoor(this, d1, d3)) {
            this.doors[d1].internalConnections[d2] = false;
            this.doors[d2].internalConnections[d1] = false;
          }
        }
      }
    }
  }
}
