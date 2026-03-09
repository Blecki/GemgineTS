import { Shader } from "./Shader.js";
export class Program {
    vertexShader;
    fragmentShader;
    constructor(vertexShader, fragmentShader) {
        this.vertexShader = vertexShader;
        this.fragmentShader = fragmentShader;
    }
    compile(gl) {
        const program = gl.createProgram();
        const vertexShader = this.vertexShader?.compile(gl, gl.VERTEX_SHADER);
        const fragmentShader = this.fragmentShader?.compile(gl, gl.FRAGMENT_SHADER);
        if (vertexShader != null)
            gl.attachShader(program, vertexShader);
        if (fragmentShader != null)
            gl.attachShader(program, fragmentShader);
        gl.linkProgram(program);
        if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
            throw new Error(`Failed to compile WebGL program: ${gl.getProgramInfoLog(program)}`);
        }
        return program;
    }
}
//# sourceMappingURL=Program.js.map