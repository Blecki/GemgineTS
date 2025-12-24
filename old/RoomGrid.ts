import { Array2D } from "./Array2D.js";
import { Room } from "./Room.js";
import { Rect } from "./Rect.js";
import { Point } from "./Point.js";

export class GridCell {
  public room: Room | null = null;
  public filled: boolean = false;
  public adjacent: boolean = false;
}

export class RoomGrid extends Array2D<GridCell> {

  constructor(width: number, height: number) {
    super(width, height);
  }
  
  placeRoomOnGrid(room: Room, markAdjacent: boolean): void {
    Rect.enumerate(room.rect, (x, y) => {
      if (this.inBounds(x,y)) {
        this.getValue(x,y).room = room;
        this.getValue(x,y).filled = true;
        this.getValue(x,y).adjacent = false;
      }
      return true;
    });
  
    if (markAdjacent) {
      Rect.enumerate(new Rect(room.rect.x - 1, room.rect.y, 1, room.rect.height), (x, y) => {
        if (this.inBounds(x,y)) this.getValue(x,y).adjacent = true;
      });
    
      Rect.enumerate(new Rect(room.rect.x + room.rect.width, room.rect.y, 1, room.rect.height), (x, y) => {
        if (this.inBounds(x,y)) this.getValue(x,y).adjacent = true;
      });
    
      Rect.enumerate(new Rect(room.rect.x, room.rect.y - 1, room.rect.width, 1), (x, y) => {
        if (this.inBounds(x,y)) this.getValue(x,y).adjacent = true;
      });
    
      Rect.enumerate(new Rect(room.rect.x, room.rect.y + room.rect.height, room.rect.width, 1), (x, y) => {
        if (this.inBounds(x,y)) this.getValue(x,y).adjacent = true;
      });
    }
  }

  canPlaceRoomOnGrid(room: Room, p: Point, invertAdjacency: boolean): boolean {
    let hitAnother = false;
    let hitsAdjacent = false;
  
    Rect.enumerate(new Rect(p.x, p.y, room.rect.width, room.rect.height), (x, y) => {
      if (!this.inBounds(x,y) || this.getValue(x,y).room != null) hitAnother = true;
    });
  
    Rect.enumerate(new Rect(p.x, p.y, room.rect.width, room.rect.height), (x, y) => {
      if (!this.inBounds(x,y)) return;
      else if (this.getValue(x,y).adjacent) hitsAdjacent = true;
    });
  
    if (invertAdjacency)
      return !hitAnother && !hitsAdjacent;
    else 
      return !hitAnother && hitsAdjacent;
  }

  getAdjacentRooms(room: Room): Room[] {
    let r: Room[] = [];
    
    Rect.enumerate(new Rect(room.rect.x - 1, room.rect.y, 1, room.rect.height), (x, y) => {
      if (this.inBounds(x,y) && this.getValue(x,y).room != null && this.getValue(x,y).room !== room) r.push(this.getValue(x,y).room as Room);
    });
  
    Rect.enumerate(new Rect(room.rect.x + room.rect.width, room.rect.y, 1, room.rect.height), (x, y) => {
      if (this.inBounds(x,y) && this.getValue(x,y).room != null && this.getValue(x,y).room !== room) r.push(this.getValue(x,y).room as Room);
    });
  
    Rect.enumerate(new Rect(room.rect.x, room.rect.y - 1, room.rect.width, 1), (x, y) => {
      if (this.inBounds(x,y) && this.getValue(x,y).room != null && this.getValue(x,y).room !== room) r.push(this.getValue(x,y).room as Room);
    });
  
    Rect.enumerate(new Rect(room.rect.x, room.rect.y + room.rect.height, room.rect.width, 1), (x, y) => {
      if (this.inBounds(x,y) && this.getValue(x,y).room != null && this.getValue(x,y).room !== room) r.push(this.getValue(x,y).room as Room);
    });
  
    return Array.from(new Set(r));
  }
  
}
