import { Room } from "./Room.js";
import { RoomGrid, GridCell } from "./RoomGrid.js";
import { Rect } from "./Rect.js";
import { Door } from "./Door.js";
import { Random } from "./Random.js";
import { Point } from "./Point.js";
import { Color } from "./Color.js";

interface RoomPair {
  first: Room;
  second: Room;
}

export class RoomDoorPair {
  public room: Room;
  public doorIndex: number;

  constructor(room: Room, doorIndex: number) {
    this.room = room;
    this.doorIndex = doorIndex;
  }
}

export class DungeonPathRoomTraversal {
  public room: Room;
  public inDoor: number;
  public outDoor: number;

  constructor(room: Room, inDoor: number, outDoor: number) {
    this.room = room;
    this.inDoor = inDoor;
    this.outDoor = outDoor;
  }
}

export class DungeonPath {
  public nodes: DungeonPathRoomTraversal[] = [];
  public cost: number = 0;
  public keyCount: number = 0;
  public bossKey: boolean = false;
  public doorsUnlocked: RoomDoorPair[] = [];
  public powerupsCollected: Room[] = [];
  public color: Color = { r: 0, g: 0, b: 0, a: 255 };
  public terminationType: number = 0;

  getCurrentNode(): DungeonPathRoomTraversal {
    return this.nodes[this.nodes.length - 1];
  }

  getPreviousNode(): DungeonPathRoomTraversal {
    return this.nodes[this.nodes.length - 2];
  }
}

export class Dungeon {

  public roomGrid: RoomGrid;
  public rooms: Room[] = [];
  public width: number = 0;
  public height: number = 0;

  public startRoom: Room;
  public bossRoom: Room;
  public keyRoom: Room;

  constructor(width: number, height: number, random: Random) {
    this.width = width;
    this.height = height;
    this.roomGrid = new RoomGrid(width, height);

    this.roomGrid.fill(() => new GridCell());
    this.rooms = []

    this.startRoom = new Room(1,1);
    this.startRoom.label = "S";
    this.startRoom.branch = 'A'.charCodeAt(0);
    this.startRoom.rect = new Rect(Math.trunc(this.width / 2), Math.trunc(this.height / 2), 1, 1);
    //this.startRoom.rect = new Rect(0,0, 1, 1);
    this.startRoom.color = { r: 255, g: 0, b:0, a: 255 };
    this.roomGrid.placeRoomOnGrid(this.startRoom, true);
    this.rooms.push(this.startRoom);

    this.bossRoom = new Room(3,3);
    this.bossRoom.label = "B";
    this.bossRoom.doorLimit = 1;
    let bossRoomPlaced = false;
    do {
      let possibleSpot = new Point(random.NextInt(0, this.width - 3), random.NextInt(0, this.height - 3));
      if (this.roomGrid.canPlaceRoomOnGrid(this.bossRoom, possibleSpot, true)) {
        this.bossRoom.rect = new Rect(possibleSpot.x, possibleSpot.y, 3, 3);
        bossRoomPlaced = true;
      }
    } while (bossRoomPlaced == false);
    this.roomGrid.placeRoomOnGrid(this.bossRoom, false);
    this.rooms.push(this.bossRoom);

    this.keyRoom = new Room(2,2);
    this.keyRoom.label = "Z";
    this.keyRoom.doorLimit = 1;
    let miniRoomPlaced = false;
    do {
      let possibleSpot = new Point(random.NextInt(0, this.width - 2), random.NextInt(0, this.height - 2));
      if (this.roomGrid.canPlaceRoomOnGrid(this.keyRoom, possibleSpot, true)) {
        this.keyRoom.rect = new Rect(possibleSpot.x, possibleSpot.y, 2, 2);
        miniRoomPlaced = true;
      }
    } while (miniRoomPlaced == false);
    this.roomGrid.placeRoomOnGrid(this.keyRoom, false);
    this.rooms.push(this.keyRoom);

    for (let i = 0; i < 40 || this.roomGrid.getAdjacentRooms(this.bossRoom).length == 0 || this.roomGrid.getAdjacentRooms(this.keyRoom).length == 0; ++i) {
      let rr = new Room(random.NextInt(1,3), random.NextInt(1,3));

      let possiblePlacements = [];
      for (let x = 0; x < this.width - 1; x++) 
        for (let y = 0; y < this.height - 1; y++) {
          let p = new Point(x, y);
          if (this.roomGrid.canPlaceRoomOnGrid(rr, p, false))
            possiblePlacements.push(p);
        }
      if (possiblePlacements.length > 0) {
        let selectedPlacement = possiblePlacements[random.NextInt(0, possiblePlacements.length - 1)];
        rr.rect = new Rect(selectedPlacement.x, selectedPlacement.y, rr.rect.width, rr.rect.height);
        this.roomGrid.placeRoomOnGrid(rr, true);
        this.rooms.push(rr);
      }
    }

    let pairList: RoomPair[] = [];
    this.rooms.forEach(r => {
      let neighbors = this.roomGrid.getAdjacentRooms(r);
      neighbors.forEach(n => {
        if (pairList.find(p => { 
          if (p.first == r && p.second == n) return true;
          if (p.second == r && p.first == n) return true;
          return false;
        }) == null) {
          pairList.push({first: r, second: n});
        }
      });
    });

    pairList.forEach(p => {  
      if (p.first.doorLimit > 0 && p.first.doors.length >= p.first.doorLimit) return;
      if (p.second.doorLimit > 0 && p.second.doors.length >= p.second.doorLimit) return;
      let direction = Rect.getRelativeDirection(p.first.rect, p.second.rect);
      if (direction == 'north') Door.createVerticalDoor(p.first, p.second, random);
      if (direction == 'south') Door.createVerticalDoor(p.second, p.first, random);
      if (direction == 'west') Door.createHorizontalDoor(p.first, p.second, random);
      if (direction == 'east') Door.createHorizontalDoor(p.second, p.first, random);
    });

    let branchQueue: Room[] = [];
    this.bossRoom.branch = 'B'.charCodeAt(0);
    this.keyRoom.branch = 'C'.charCodeAt(0);
    
    let branchCode: number = 'D'.charCodeAt(0);
    let keyCount = 0;
    this.rooms.forEach(r => {
      if (r.doors.length == 1 && r.label == "") {
        r.label = "K";
        r.branch = branchCode;
        branchQueue.push(r);
        branchCode += 1;
        keyCount += 1;
      }
    });

    while (branchQueue.length > 0) {
      let current = branchQueue.shift();
      current?.doors.forEach(d => {
        if (d.neighbor.branch != 0) return;
        d.neighbor.branch = current.branch;
        branchQueue.push(d.neighbor);
      });
    }

    let allBranches = Array.from(new Set(this.rooms.map(r => r.branch)));
    allBranches.forEach(b => {
      let color = this.generateRandomColor(random);
      let allRoomsInBranch = this.rooms.filter(r => r.branch == b);
      allRoomsInBranch.forEach(r => r.color = color);

      let borderingRooms = this.rooms.filter(r => r.branch != b && r.doors.some(d => d.neighbor.branch == b));
      allBranches.forEach(b2 => {
        if (b == b2) return;
        let adjacent = borderingRooms.filter(r => r.branch == b2);
        if (adjacent.length > 1) {
          adjacent.shift();
          adjacent.forEach(a => {
            let doorsToDelete = a.doors.filter(d => d.neighbor.branch == b);
            a.doors = a.doors.filter(d => d.neighbor.branch != b);
            doorsToDelete.forEach(dd => {
              dd.neighbor.deleteReturnDoor(a);
            });
          });
        }
      });
    });

    this.rooms.forEach(r => {
      r.doors.forEach(d => {
        if (d.neighbor.branch != r.branch) d.locked = 1;
      });
    });

    for (let i = 0; i < 10; ++i) {
      let index = random.NextInt(4, this.rooms.length - 1);
      if (this.rooms[index].label == '')
        this.rooms[index].label = 'P';
    }

    for (let d of this.startRoom.doors) {
      d.locked = 0;
      let rdoor = d.neighbor.getReturnDoor(this.startRoom);
      if (rdoor != undefined) rdoor.locked = 0;
    }

    this.bossRoom.doors[0].locked = 2;
    let bossNeighborDoor = this.bossRoom.doors[0].neighbor.getReturnDoor(this.bossRoom);
    if (bossNeighborDoor != undefined) bossNeighborDoor.locked = 2;
  }
    
  generateRandomColor(random: Random) {
      const r = Math.floor(random.NextFloat() * 200);
      const g = Math.floor(random.NextFloat() * 200);
      const b = Math.floor(random.NextFloat() * 200);
      return {r: r, g: g, b: b, a: 255};
  }

  doorListContains(doorsUnlocked: RoomDoorPair[], room: Room, door: number): boolean {
    return doorsUnlocked.some(du => { return du.room === room && du.doorIndex == door; });
  }

  canPassDoor(door: Door, room: Room, doorIndex: number, keyCount: number, bossKey: boolean, doorsUnlocked: RoomDoorPair[]) {
    if (door.locked == 0) return true;
    if (this.doorListContains(doorsUnlocked, room, doorIndex)) return true;
    if (door.locked == 1 && keyCount > 0) return true;
    if (door.locked == 2 && bossKey) return true;
    return false;
  }

  findPaths(start: Room, end: (room:Room) => boolean, doorsUnlocked: RoomDoorPair[], inputKeys: number, bossKey: boolean): DungeonPath {
    let paths = start.doors
      .filter((d, i) => this.canPassDoor(d, start, i, inputKeys, bossKey, doorsUnlocked))
      .map((d, i) => {
        let r = new DungeonPath();
        r.nodes.push(new DungeonPathRoomTraversal(start, -1, i));
        r.cost = 0;
        r.keyCount = inputKeys;
        r.bossKey = bossKey;
        r.doorsUnlocked.push(...doorsUnlocked);

        if (this.doorListContains(doorsUnlocked, start, i)) return r;

        if (d.locked == 1) {
          r.keyCount -= 1;
          r.doorsUnlocked.push(new RoomDoorPair(start, i));
          r.doorsUnlocked.push(new RoomDoorPair(start.doors[i].neighbor, start.doors[i].neighbor.getReturnDoorIndex(start)));
        }

        if (d.locked == 2) {
          r.bossKey = false;
          r.doorsUnlocked.push(new RoomDoorPair(start, i));
          r.doorsUnlocked.push(new RoomDoorPair(start.doors[i].neighbor, start.doors[i].neighbor.getReturnDoorIndex(start)));
        }

        return r;
      });

    let completePaths: DungeonPath[] = [];

    while (true) {
      let nextPaths: DungeonPath[] = [];
      for (let p of paths) {
        let expanded = this.expandPath(p);
        for (let e of expanded) {
          let pend = e.getCurrentNode();
          if (end(pend.room)) {
            pend.outDoor = -1;
            return e;
          }
          else 
            nextPaths.push(e);
        }
      }
      paths = nextPaths;
      if (paths.length == 0) {
        if (doorsUnlocked.length == 0) {
          let r = new DungeonPath();
          r.nodes.push(new DungeonPathRoomTraversal(start, -1, -1));
          r.terminationType = 1;
          return r;
        }
        // Remove last locked door.
        this.unlock(doorsUnlocked[doorsUnlocked.length - 1]);
        this.unlock(doorsUnlocked[doorsUnlocked.length - 2]);
        return this.findPaths(start, end, doorsUnlocked.slice(0, doorsUnlocked.length - 2), inputKeys, bossKey);
      }
    }
  }

  unlock(door: RoomDoorPair) {
    door.room.doors[door.doorIndex].locked = 0;
  }

  expandPath(path: DungeonPath): DungeonPath[] {
    let r: DungeonPath[] = [];
    let endNode = path.getCurrentNode();
    let neighbor = endNode.room.doors[endNode.outDoor].neighbor;
    if (path.nodes.some(n => n.room === neighbor)) return r;

    let rDoor = neighbor.getReturnDoor(endNode.room);
    if (rDoor == undefined) return r;
    
    let rDoorIndex = neighbor.doors.indexOf(rDoor);

    for (let d = 0; d < neighbor.doors.length; ++d) {
      let expanded = new DungeonPath();
      path.nodes.forEach(n => expanded.nodes.push(n));
      expanded.nodes.push(new DungeonPathRoomTraversal(neighbor, rDoorIndex, d));
      path.doorsUnlocked.forEach(n => expanded.doorsUnlocked.push(n));
      expanded.cost = path.cost + 1;
      expanded.keyCount = path.keyCount;
      expanded.bossKey = path.bossKey;

      let canPass = false;

      if (neighbor.doors[d].locked == 0) canPass = true;
      else if (this.doorListContains(expanded.doorsUnlocked, neighbor, d)) canPass = true;
      else if (neighbor.doors[d].locked == 1 && expanded.keyCount > 0) {
        canPass = true;
        expanded.keyCount -= 1;
        expanded.doorsUnlocked.push(new RoomDoorPair(neighbor, d));
        expanded.doorsUnlocked.push(new RoomDoorPair(neighbor.doors[d].neighbor, neighbor.doors[d].neighbor.getReturnDoorIndex(neighbor)));
      }
      else if (neighbor.doors[d].locked == 2 && expanded.bossKey) {
        canPass = true;
        expanded.bossKey = false;
        expanded.doorsUnlocked.push(new RoomDoorPair(neighbor, d));
        expanded.doorsUnlocked.push(new RoomDoorPair(neighbor.doors[d].neighbor, neighbor.doors[d].neighbor.getReturnDoorIndex(neighbor)));
      }

      if (canPass)
        r.push(expanded);
    }

    return r;
  }
}