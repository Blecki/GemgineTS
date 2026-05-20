export class Mesh {
  public verticies: Float32Array = new Float32Array();
  public indices: Uint16Array = new Uint16Array();
  public uvs: Float32Array = new Float32Array();

  public positionBuffer: WebGLBuffer | null = null;
  public indexBuffer: WebGLBuffer | null = null;
  public uvBuffer: WebGLBuffer | null = null;

  public _triangleCount: number = 0;
  public get triangleCount() : number { return this._triangleCount; }

  public updateBuffer(gl: WebGLRenderingContext) {
    if (this.positionBuffer == null) this.positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.STATIC_DRAW);

    if (this.indexBuffer == null) this.indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);

    if (this.uvBuffer == null) this.uvBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);

    this._triangleCount = this.indices.length / 3;
  }

  public static fromVertexList(verticies: Float32Array, indicies: Uint16Array, uvs: Float32Array) : Mesh {
    let r = new Mesh();
    r.verticies = verticies;
    r.indices = indicies;
    r.uvs = uvs;
    return r;
  }
}
