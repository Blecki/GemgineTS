import { Shader } from "./Shader.js";

export class Program {
  public vertexShader: Shader | null;
  public fragmentShader: Shader | null;

  constructor(vertexShader: Shader | null, fragmentShader: Shader | null) {
    this.vertexShader = vertexShader;
    this.fragmentShader = fragmentShader;
  }

  compile(gl: WebGLRenderingContext): WebGLProgram | null {
    const program = gl.createProgram();
    const vertexShader = this.vertexShader?.compile(gl, gl.VERTEX_SHADER);
    const fragmentShader = this.fragmentShader?.compile(gl, gl.FRAGMENT_SHADER);
    
    if (vertexShader != null) gl.attachShader(program, vertexShader);
    if (fragmentShader != null) gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      throw new Error(`Failed to compile WebGL program: ${gl.getProgramInfoLog(program)}`);
    }

    return program;
  }
}