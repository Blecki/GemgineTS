export class Texture {
  private texture: WebGLTexture;
  private source: ImageBitmap;

  constructor(bitmap: ImageBitmap, gl: WebGL2RenderingContext) {
    this.texture = gl.createTexture();
    this.source = bitmap;
  }

  public bind(gl: WebGL2RenderingContext, slot: GLenum): void {
    console.log(this.source);
    gl.activeTexture(slot);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D, // Target
      0,             // Mip level
      gl.RGBA8,       // Internal format
      gl.RGBA,       // Format
      gl.UNSIGNED_BYTE, // Type
      this.source);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  }    
}
