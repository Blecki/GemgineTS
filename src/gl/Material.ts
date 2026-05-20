import { Program } from "./Program.js";
import { type Vector3 } from "./Vector3.js";
import { type Matrix4x4 } from "./Matrix4x4.js";
import { Texture } from "./Texture.js";

type MaterialUniformSetter = (value: any) => void;

export class MaterialUniform {
  public rawUniform: WebGLActiveInfo;
  public value: any;
  public setter: MaterialUniformSetter;
  public textureUnit: number = 0;

  constructor(rawUniform: WebGLActiveInfo, setter: MaterialUniformSetter) {
    this.rawUniform = rawUniform;
    this.setter = setter;
  }
}

type MaterialAttribSetter = (value: any) => void;

export class MaterialAttrib {
  public rawAttrib: WebGLActiveInfo;
  public value: any;
  public setter: MaterialAttribSetter | null;

  constructor(rawAttrib: WebGLActiveInfo, setter: MaterialAttribSetter | null) {
    this.rawAttrib = rawAttrib;
    this.setter = setter;
  }
}

export class Material {
  private gl: WebGLRenderingContext;
  private compiledShader: WebGLProgram | null;
  private uniforms: Map<string, MaterialUniform> = new Map<string, MaterialUniform>();
  private attribs: Map<string, MaterialAttrib | null> = new Map<string, MaterialAttrib | null>();
  private nextTextureUnit: number = 0;

  constructor (gl: WebGLRenderingContext, shader: Program) {
    this.gl = gl;
    this.compiledShader = shader.compile(gl);
    
    if (this.compiledShader != null) {
      const uniformCount = gl.getProgramParameter(this.compiledShader, gl.ACTIVE_UNIFORMS);
      for (let i = 0; i < uniformCount; ++i) {
        const info = gl.getActiveUniform(this.compiledShader, i);
        if (info)
          this.uniforms.set(info.name, this.createUniformSetter(info));
      }

      const attribCount = gl.getProgramParameter(this.compiledShader, gl.ACTIVE_ATTRIBUTES);
      for (let i = 0; i < attribCount; ++i) {
        const info = gl.getActiveAttrib(this.compiledShader, i);
        if (info) 
          this.attribs.set(info.name, this.createAttribSetter(info));
      }
    }
  }

  private createUniformSetter(uniform: WebGLActiveInfo): MaterialUniform {
    if (this.compiledShader != null) {
      const loc = this.gl.getUniformLocation(this.compiledShader, uniform.name);
      if (!loc) return new MaterialUniform(uniform, () => {}); // No-op if optimized out

      const type = uniform.type;
      
      // Vectors and Scalars
      switch (uniform.type) {
        case this.gl.FLOAT_MAT4:  return new MaterialUniform(uniform, (v: Matrix4x4) => this.gl.uniformMatrix4fv(loc, false, v));
        case this.gl.FLOAT_MAT3:  return new MaterialUniform(uniform, (v: Matrix4x4) => this.gl.uniformMatrix3fv(loc, false, v));
        case this.gl.FLOAT_MAT2:  return new MaterialUniform(uniform, (v: Matrix4x4) => this.gl.uniformMatrix2fv(loc, false, v));
        case this.gl.FLOAT:       return new MaterialUniform(uniform, (v: number) => this.gl.uniform1f(loc, v));
        case this.gl.FLOAT_VEC2:  return new MaterialUniform(uniform, (v: vec2) => this.gl.uniform2fv(loc, v));
        case this.gl.FLOAT_VEC3:  return new MaterialUniform(uniform, (v: Vector3) => this.gl.uniform3f(loc, v.x, v.y, v.z));
        case this.gl.FLOAT_VEC4:  return new MaterialUniform(uniform, (v: vec4) => this.gl.uniform4fv(loc, v));
        //case gl.INT:
        //case gl.BOOL:
        case this.gl.SAMPLER_2D: {
          let r = new MaterialUniform(uniform, (tex: Texture) => {});
          r.textureUnit = this.nextTextureUnit;
          this.nextTextureUnit += 1;
          r.setter = (tex: Texture) => {
            tex.bind(this.gl, this.gl.TEXTURE0 + r.textureUnit);
            this.gl.uniform1i(loc, r.textureUnit);
          };
          return r;
        }
        case this.gl.SAMPLER_CUBE: {
          let r = new MaterialUniform(uniform, (tex: Texture) => {});
          r.textureUnit = this.nextTextureUnit;
          this.nextTextureUnit += 1;
          r.setter = (tex: Texture) => {
            tex.bind(this.gl, this.gl.TEXTURE0 + r.textureUnit);
            this.gl.uniform1i(loc, r.textureUnit);
          };
          return r;
        }
        default:
          return new MaterialUniform(uniform, (v: any) => console.warn(`No setter for type: ${type}`));
      }
    }

    return new MaterialUniform(uniform, () => {});
  }

  private createAttribSetter(attrib: WebGLActiveInfo): MaterialAttrib | null {
    if (this.compiledShader != null) {
      console.log(attrib);
      const loc = this.gl.getAttribLocation(this.compiledShader, attrib.name);
      console.log(loc);
      //if (!loc) return null;

      // Vectors and Scalars
      switch (attrib.type) {
        case this.gl.FLOAT_MAT4:  return null;
        case this.gl.FLOAT_MAT3:  return null;
        case this.gl.FLOAT_MAT2:  return null;
        case this.gl.FLOAT:       return null;
        case this.gl.FLOAT_VEC2:  
          console.log("FLOAT_VEC2");
          return new MaterialAttrib(attrib, (value) => {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, value);
            this.gl.vertexAttribPointer(loc, 2, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(loc);
          });
        case this.gl.FLOAT_VEC3:  return null;
        case this.gl.FLOAT_VEC4:  
          console.log("FLOAT_VEC4");
          return new MaterialAttrib(attrib, (value) => {
            this.gl.bindBuffer(this.gl.ARRAY_BUFFER, value);
            this.gl.vertexAttribPointer(loc, 4, this.gl.FLOAT, false, 0, 0);
            this.gl.enableVertexAttribArray(loc);
          });
        //case gl.INT:
        //case gl.BOOL:
        case this.gl.SAMPLER_2D: return null;
        case this.gl.SAMPLER_CUBE: return null;
        default:
          return null;
      }
    }

    return null;
  }

  public setUniform(name: string, value: any) : void {
    // Should type check to make sure the value is the right type.
    if (this.uniforms.has(name)) {
      let uniform = this.uniforms.get(name);
      if (uniform !== undefined)
        uniform.value = value;
    }
    else
      throw `Material error: Uniform "${name}" not found in program.`;
  }

  public setAttribImmediate(name: string, value: any) : void {
    // Should type check to make sure the value is the right type.
    if (this.attribs.has(name)) {
      let attrib = this.attribs.get(name);
      if (attrib !== undefined && attrib !== null && attrib.setter !== null)
        attrib.setter(value);
    }
    else
      throw `Material error: Attrib "${name}" not found in program.`;
  }

  public bind() {
    this.gl.useProgram(this.compiledShader);
    this.uniforms.forEach(element => {
      element.setter(element.value);
    });
  }

}
