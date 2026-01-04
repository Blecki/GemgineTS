export class Shader {
  public source: string = "";

  constructor(source:string) {
    this.source = source;
  }

  compile(gl: WebGLRenderingContext, type: number) : WebGLShader | null{
    const shader = gl.createShader(type);
    if (shader == null) return null;
    gl.shaderSource(shader, this.source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      throw new Error(`Failed to compile shader: ${gl.getShaderInfoLog(shader)}`);
    }
    return shader;
  }
}
