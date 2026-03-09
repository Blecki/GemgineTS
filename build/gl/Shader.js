export class Shader {
    source = "";
    constructor(source) {
        this.source = source;
    }
    compile(gl, type) {
        const shader = gl.createShader(type);
        if (shader == null)
            return null;
        gl.shaderSource(shader, this.source);
        gl.compileShader(shader);
        if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
            throw new Error(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`);
        }
        return shader;
    }
}
//# sourceMappingURL=Shader.js.map