export class Array2D<T> {
  private data: T[];
  private readonly _width: number;
  private readonly _height: number;

  constructor(width: number, height: number) {
    this.data = new Array(width * height);
    this._width = width;
    this._height = height;
  }

  
  get width(): number {
      return this._width;
  }

  get height(): number {
      return this._height;
  }
  
  setValue(x: number, y: number, v: T): void {
      const index = (y * this._width + x);
      this.data[index] = v;
  }

  getValue(x: number, y: number): T {
    const index = (y * this._width + x);
    return this.data[index];
  }

  inBounds(x: number, y: number) : boolean {
    if (x < 0 || x >= this._width) return false;
    if (y < 0 || y >= this._height) return false;
    return true;
  }

  fill(constructor: () => T) {
    for (let x = 0; x < this._width * this._height; x++) 
        this.data[x] = constructor();
      console.log(this);
    }
}
