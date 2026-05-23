import { Program } from "./Program.js";
import {} from "./Vector3.js";
import {} from "./Matrix4x4.js";
import { Texture } from "./Texture.js";
export class MaterialUniform {
    rawUniform;
    value;
    setter;
    textureUnit = 0;
    constructor(rawUniform, setter) {
        this.rawUniform = rawUniform;
        this.setter = setter;
    }
}
export class MaterialAttrib {
    rawAttrib;
    value;
    setter;
    constructor(rawAttrib, setter) {
        this.rawAttrib = rawAttrib;
        this.setter = setter;
    }
}
export class Material {
    gl;
    compiledShader;
    uniforms = new Map();
    attribs = new Map();
    nextTextureUnit = 0;
    constructor(gl, shader) {
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
    createUniformSetter(uniform) {
        if (this.compiledShader != null) {
            const loc = this.gl.getUniformLocation(this.compiledShader, uniform.name);
            if (!loc)
                return new MaterialUniform(uniform, () => { }); // No-op if optimized out
            const type = uniform.type;
            // Vectors and Scalars
            switch (uniform.type) {
                case this.gl.FLOAT_MAT4: return new MaterialUniform(uniform, (v) => this.gl.uniformMatrix4fv(loc, false, v));
                case this.gl.FLOAT_MAT3: return new MaterialUniform(uniform, (v) => this.gl.uniformMatrix3fv(loc, false, v));
                case this.gl.FLOAT_MAT2: return new MaterialUniform(uniform, (v) => this.gl.uniformMatrix2fv(loc, false, v));
                case this.gl.FLOAT: return new MaterialUniform(uniform, (v) => this.gl.uniform1f(loc, v));
                case this.gl.FLOAT_VEC2: return new MaterialUniform(uniform, (v) => this.gl.uniform2fv(loc, v));
                case this.gl.FLOAT_VEC3: return new MaterialUniform(uniform, (v) => this.gl.uniform3f(loc, v.x, v.y, v.z));
                case this.gl.FLOAT_VEC4: return new MaterialUniform(uniform, (v) => this.gl.uniform4fv(loc, v));
                //case gl.INT:
                //case gl.BOOL:
                case this.gl.SAMPLER_2D: {
                    let r = new MaterialUniform(uniform, (tex) => { });
                    r.textureUnit = this.nextTextureUnit;
                    this.nextTextureUnit += 1;
                    r.setter = (tex) => {
                        tex.bind(this.gl, this.gl.TEXTURE0 + r.textureUnit);
                        this.gl.uniform1i(loc, r.textureUnit);
                    };
                    return r;
                }
                case this.gl.SAMPLER_CUBE: {
                    let r = new MaterialUniform(uniform, (tex) => { });
                    r.textureUnit = this.nextTextureUnit;
                    this.nextTextureUnit += 1;
                    r.setter = (tex) => {
                        tex.bind(this.gl, this.gl.TEXTURE0 + r.textureUnit);
                        this.gl.uniform1i(loc, r.textureUnit);
                    };
                    return r;
                }
                default:
                    return new MaterialUniform(uniform, (v) => console.warn(`No setter for type: ${type}`));
            }
        }
        return new MaterialUniform(uniform, () => { });
    }
    createAttribSetter(attrib) {
        if (this.compiledShader != null) {
            const loc = this.gl.getAttribLocation(this.compiledShader, attrib.name);
            //if (!loc) return null;
            // Vectors and Scalars
            switch (attrib.type) {
                case this.gl.FLOAT_MAT4: return null;
                case this.gl.FLOAT_MAT3: return null;
                case this.gl.FLOAT_MAT2: return null;
                case this.gl.FLOAT: return null;
                case this.gl.FLOAT_VEC2:
                    return new MaterialAttrib(attrib, (value) => {
                        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, value);
                        this.gl.vertexAttribPointer(loc, 2, this.gl.FLOAT, false, 0, 0);
                        this.gl.enableVertexAttribArray(loc);
                    });
                case this.gl.FLOAT_VEC3: return null;
                case this.gl.FLOAT_VEC4:
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
    setUniform(name, value) {
        // Should type check to make sure the value is the right type.
        if (this.uniforms.has(name)) {
            let uniform = this.uniforms.get(name);
            if (uniform !== undefined)
                uniform.value = value;
        }
        else
            throw `Material error: Uniform "${name}" not found in program.`;
    }
    setAttribImmediate(name, value) {
        // Should type check to make sure the value is the right type.
        if (this.attribs.has(name)) {
            let attrib = this.attribs.get(name);
            if (attrib !== undefined && attrib !== null && attrib.setter !== null)
                attrib.setter(value);
        }
        else
            throw `Material error: Attrib "${name}" not found in program.`;
    }
    bind() {
        this.gl.useProgram(this.compiledShader);
        this.uniforms.forEach(element => {
            element.setter(element.value);
        });
    }
}
//# sourceMappingURL=Material.js.map