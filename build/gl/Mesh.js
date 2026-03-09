export class Mesh {
    verticies = new Float32Array();
    indices = new Uint16Array();
    positionBuffer = null;
    indexBuffer = null;
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
    }
    static fromVertexList(verticies, indicies) {
        let r = new Mesh();
        r.verticies = verticies;
        r.indices = indicies;
        return r;
    }
}
//# sourceMappingURL=Mesh.js.map