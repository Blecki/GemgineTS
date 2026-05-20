export class Texture {
  public texture: WebGLTexture;
  public image: ImageBitmap;

  constructor(context: WebGLRenderingContext, image: ImageBitmap) {
    this.texture = context.createTexture();
    this.image = image;
  }

  public bind(gl: WebGLRenderingContext, slot: GLenum): void {
    gl.activeTexture(slot);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.texImage2D(
      gl.TEXTURE_2D, // Target
      0,             // Mip level
      gl.RGBA,       // Internal format
      gl.RGBA,       // Format
      gl.UNSIGNED_BYTE, // Type
      this.image);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  }    
}
