var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, componentType } from "./Component.js";
import { Module } from "./Module.js";
import { RenderContext } from "./RenderContext.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Engine } from "./Engine.js";
import { GameTime } from "./GameTime.js";
import { RenderLayers, RenderChannels } from "./RenderLayers.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { AssetReference } from "./AssetReference.js";
import { Point } from "./Point.js";
import { Rect } from "./Rect.js";
import { LightComponent } from "./LightComponent.js";
import { RawImage } from "./RawImage.js";
import { Vector3, v3sub, v3magnitudeSquared, v3dotProduct, v3normalize } from "./Vector3.js";
import { Color } from "./Color.js";
import { Shader } from "./Shader.js";
export class RenderComponent extends Component {
    renderLayer = RenderLayers.Background;
    renderChannel = RenderChannels.Diffuse;
    render(context) { }
}
let DebugGizmoComponent = class DebugGizmoComponent extends RenderComponent {
    point = null;
    initialize(engine, template, prototypeAsset) {
        this.point = engine.getAsset("assets/point.png").asset;
        this.renderLayer = RenderLayers.Objects;
        this.renderChannel = RenderChannels.Diffuse;
    }
    render(context) {
        /*
        if (this.parent != null) {
          var ctx = context.getTarget(RenderLayers.Objects, RenderChannels.Diffuse);
          ctx.drawRectangle(this.parent.globalBounds, 'rgba(255, 0, 0, 0.5)');
          if (this.point != null)
            ctx.drawImage(this.point, new Rect(0, 0, this.point.width, this.point.height), new Point(this.parent.globalPosition.x - 2, this.parent.globalPosition.y - 2));
        }
        */
    }
};
DebugGizmoComponent = __decorate([
    componentType("DebugGizmo")
], DebugGizmoComponent);
export { DebugGizmoComponent };
class Light {
    screenPosition;
    radius;
    color;
    intensity;
    constructor(screenPosition, radius, color, intensity) {
        this.screenPosition = screenPosition;
        this.radius = radius;
        this.color = color;
        this.intensity = intensity;
    }
}
export class RenderModule extends Module {
    renderables = [];
    animatables = [];
    lights = [];
    camera = null;
    fpsQueue = [];
    destinationCanvas;
    gl;
    renderContext;
    program = null;
    LightZ = 64;
    constructor(canvas) {
        super();
        this.destinationCanvas = canvas;
        let ctx = this.destinationCanvas.getContext('webgl');
        if (ctx == null)
            throw new Error("Failed to get WebGL context");
<<<<<<< HEAD
        this.destinationContext = ctx;
        //this.destinationContext.imageSmoothingEnabled = false;
        this.renderContext = new RenderContext(this.destinationCanvas.width, this.destinationCanvas.height, this.destinationContext);
        this.compositeBuffer = new RawImage(new ImageData(this.destinationCanvas.width, this.destinationCanvas.height), this.destinationCanvas.width, this.destinationCanvas.height);
        const vertexShader = this.compileShader(this.destinationContext, `
        attribute vec4 a_position; // [-1, -1] to [1, 1]
        varying vec2 v_texcoord;   
        
        void main() {
          gl_Position = a_position;
          v_texcoord = (a_position.xy * 0.5) + 0.5;
          v_texcoord.y = 1.0 - v_texcoord.y;
        }
      `, this.destinationContext.VERTEX_SHADER);
        const fragmentShader = this.compileShader(this.destinationContext, `
      precision highp float;

      uniform sampler2D u_diffuse;
      uniform sampler2D u_objects;
      uniform sampler2D u_normals;
      uniform sampler2D u_collision;
      varying vec2 v_texcoord;

      const int MAX_LIGHTS = 5; 

      struct Light {
          vec2 position;
          float radius;
          vec3 color;
          float intensity;
      };

      uniform Light u_lights[MAX_LIGHTS];
      uniform int u_numActiveLights;

      void main() {
       
        float destx = 528.0 * v_texcoord.x;
        float desty = 224.0 * v_texcoord.y;

        vec3 lighting = vec3(0.1, 0.1, 0.1);
        vec4 object = texture2D(u_objects, v_texcoord);
        
        if (object.a > 0.5) 
        {
          for (int i = 0; i < MAX_LIGHTS; i++) 
          {
            if (i >= u_numActiveLights) break; 
            float distanceToLight = sqrt(
              ((destx - u_lights[i].position.x) * (destx - u_lights[i].position.x)) +
              ((desty - u_lights[i].position.y) * (desty - u_lights[i].position.y)) 
            );
            float lightIntensity = max(0.0, 1.0 - (distanceToLight / u_lights[i].radius));
            
            lighting = vec3(lighting.r + (lightIntensity * u_lights[i].color.r * u_lights[i].intensity),
                        lighting.g + (lightIntensity * u_lights[i].color.g * u_lights[i].intensity),
                        lighting.b + (lightIntensity * u_lights[i].color.b * u_lights[i].intensity));
          }      

          gl_FragColor = vec4(object.r * lighting.r, 
                          object.g * lighting.g,
                          object.b * lighting.b,
                          1.0);
        }
        else 
        {
          vec4 diffuse = texture2D(u_diffuse, v_texcoord);
          vec4 normal = texture2D(u_normals, v_texcoord);
          vec4 collision = texture2D(u_collision, v_texcoord);
          vec3 surfaceNormal = vec3((2.0 * normal.r) - 1.0, (2.0 * normal.g) - 1.0, (2.0 * normal.b) - 1.0);

          for (int i = 0; i < MAX_LIGHTS; i++) 
          {
            if (i >= u_numActiveLights) break; 
            float distanceToLight = sqrt(
              ((destx - u_lights[i].position.x) * (destx - u_lights[i].position.x)) +
              ((desty - u_lights[i].position.y) * (desty - u_lights[i].position.y)) 
            );
            vec3 lightDirection = vec3(u_lights[i].position.x - destx, u_lights[i].position.y - desty, 64.0);

            float shadow = 1.0;
            if (collision.r < 0.5) {
              vec2 halfLight = vec2(lightDirection.x / 2.0, lightDirection.y / 2.0);
              vec2 objectIntersection = vec2((halfLight.x + destx) / 528.0, (halfLight.y + desty) / 224.0);
              vec4 objectShadow = texture2D(u_objects, objectIntersection);
              if (objectShadow.a > 0.5) continue;
            }
            
            float cosAngle = dot(normalize(surfaceNormal), normalize(lightDirection));
            float lightIntensity = max(0.0, 1.0 - (distanceToLight / u_lights[i].radius)) * max(0.0, cosAngle);
            float shininess = 64.0; 
            float specularIntensity = min(lightIntensity, pow(max(0.0, cosAngle), shininess));

            lighting = vec3(
              lighting.r + ((lightIntensity + specularIntensity) * u_lights[i].color.r * u_lights[i].intensity),
              lighting.g + ((lightIntensity + specularIntensity) * u_lights[i].color.g * u_lights[i].intensity),
              lighting.b + ((lightIntensity + specularIntensity) * u_lights[i].color.b * u_lights[i].intensity));
          }      

          gl_FragColor = vec4( diffuse.r * (floor(lighting.r * 4.0) / 4.0), 
                               diffuse.g * (floor(lighting.g * 4.0) / 4.0),
                               diffuse.b * (floor(lighting.b * 4.0) / 4.0),
                               1.0);
        }
      }
    `, this.destinationContext.FRAGMENT_SHADER);
        this.program = this.compileProgram(this.destinationContext, vertexShader, fragmentShader);
        this.destinationContext.useProgram(this.program);
        const positionBuffer = this.destinationContext.createBuffer();
        this.destinationContext.bindBuffer(this.destinationContext.ARRAY_BUFFER, positionBuffer);
=======
        this.gl = ctx;
        this.renderContext = new RenderContext(this.destinationCanvas.width, this.destinationCanvas.height, this.gl);
    }
    engineStart(engine) {
        const vertexShader = engine.getAsset("final-composite-vertex.glsl").asset.compile(this.gl, this.gl.VERTEX_SHADER);
        const fragmentShader = engine.getAsset("final-composite-fragment.glsl").asset.compile(this.gl, this.gl.FRAGMENT_SHADER);
        this.program = this.compileProgram(this.gl, vertexShader, fragmentShader);
        this.gl.useProgram(this.program);
        const positionBuffer = this.gl.createBuffer();
        this.gl.bindBuffer(this.gl.ARRAY_BUFFER, positionBuffer);
>>>>>>> 1c192f3a2c011a6c9832468261395b7585399c93
        const positions = new Float32Array([
            -1.0, -1.0,
            1.0, -1.0,
            -1.0, 1.0,
            1.0, 1.0
        ]);
        this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
        if (this.program != null) {
            const positionLocation = this.gl.getAttribLocation(this.program, "a_position");
            this.gl.enableVertexAttribArray(positionLocation);
            this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
        }
    }
    isRenderable(object) {
        return 'render' in object;
    }
    isAnimatable(object) {
        return 'animate' in object;
    }
    isLight(object) {
        return 'offset' in object && 'radius' in object && 'color' in object && 'intensity' in object;
    }
    entityCreated(entity) {
        entity.components.forEach(component => {
            if (this.isRenderable(component)) {
                this.renderables.push(component);
            }
            if (this.isAnimatable(component)) {
                this.animatables.push(component);
            }
            if (this.isLight(component)) {
                this.lights.push(component);
            }
        });
    }
    render(engine) {
        // Render scene to buffers
        this.animatables.forEach(a => a.animate());
        this.renderContext.prepAll();
        if (this.camera == null)
            return;
        for (let renderable of this.renderables) {
            renderable.render(this.renderContext);
        }
        this.fpsQueue.push(GameTime.getDeltaTime());
        if (this.fpsQueue.length > 200)
            this.fpsQueue.shift();
        var objectDiffuse = this.renderContext.getTarget(RenderLayers.Objects, RenderChannels.Diffuse);
        let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
        let fps = Math.round(1 / averageFrameTime).toString();
        objectDiffuse.drawString(fps, new Point(5, 5), 'white');
        this.renderContext.flushAll(this.camera);
        // Composite buffers onto screen.
        this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
        if (this.program != null) {
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_diffuse"), 0);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_objects"), 1);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_normals"), 2);
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_collision"), 3);
            this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Diffuse).bind(this.gl, this.gl.TEXTURE0);
            objectDiffuse.bind(this.gl, this.gl.TEXTURE1);
            this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Normals).bind(this.gl, this.gl.TEXTURE2);
            this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Collision).bind(this.gl, this.gl.TEXTURE3);
            let localLights = this.lights.map(lc => {
                return new Light((lc.parent?.globalPosition.add(lc.offset).add(this.camera?.drawOffset ?? new Point(0, 0))) ?? new Point(0, 0), lc.radius, lc.color, lc.intensity);
            });
            this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_numActiveLights"), localLights.length);
            for (let i = 0; i < localLights.length; i++) {
                this.gl.uniform2fv(this.gl.getUniformLocation(this.program, `u_lights[${i}].position`), new Float32Array([localLights[i].screenPosition.x, localLights[i].screenPosition.y]));
                this.gl.uniform3fv(this.gl.getUniformLocation(this.program, `u_lights[${i}].color`), new Float32Array([localLights[i].color.r / 255, localLights[i].color.g / 255, localLights[i].color.b / 255]));
                this.gl.uniform1f(this.gl.getUniformLocation(this.program, `u_lights[${i}].radius`), localLights[i].radius);
                this.gl.uniform1f(this.gl.getUniformLocation(this.program, `u_lights[${i}].intensity`), localLights[i].intensity);
            }
            this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
        }
    }
    setCamera(camera) {
        this.camera = camera;
    }
    compileProgram(context, vertexShader, fragmentShader) {
        const program = context.createProgram();
        if (vertexShader != null)
            context.attachShader(program, vertexShader);
        if (fragmentShader != null)
            context.attachShader(program, fragmentShader);
        context.linkProgram(program);
        if (!context.getProgramParameter(program, context.LINK_STATUS)) {
            throw new Error(`Failed to compile WebGL program: ${context.getProgramInfoLog(program)}`);
        }
        return program;
    }
}
//# sourceMappingURL=RenderModule.js.map