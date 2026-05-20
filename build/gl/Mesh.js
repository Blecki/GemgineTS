export class Mesh {
    verticies = new Float32Array();
    indices = new Uint16Array();
    uvs = new Float32Array();
    positionBuffer = null;
    indexBuffer = null;
    uvBuffer = null;
    _triangleCount = 0;
    get triangleCount() { return this._triangleCount; }
    updateBuffer(gl) {
        if (this.positionBuffer == null)
            this.positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.verticies, gl.STATIC_DRAW);
        if (this.indexBuffer == null)
            this.indexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
        gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, this.indices, gl.STATIC_DRAW);
        if (this.uvBuffer == null)
            this.uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, this.uvBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        this._triangleCount = this.indices.length / 3;
    }
    static fromVertexList(verticies, indicies, uvs) {
        let r = new Mesh();
        r.verticies = verticies;
        r.indices = indicies;
        r.uvs = uvs;
        return r;
    }
}
//# sourceMappingURL=Mesh.js.map