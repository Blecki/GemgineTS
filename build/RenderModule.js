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
import { Texture } from "./Texture.js";
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
        //*
        if (this.parent != null) {
            var ctx = context.getTarget(RenderLayers.Objects, RenderChannels.Diffuse);
            ctx.drawRectangle(this.parent.globalBounds, 'rgba(255, 0, 0, 0.5)');
            if (this.point != null)
                ctx.drawImage(this.point, new Rect(0, 0, this.point.width, this.point.height), new Point(this.parent.globalPosition.x - 2, this.parent.globalPosition.y - 2));
        }
        //*/
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
        let ctx = this.destinationCanvas.getContext('webgl2');
        if (ctx == null)
            throw new Error("Failed to get WebGL context");
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
            this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Diffuse).bind(this.gl, this.gl.TEXTURE0);
            objectDiffuse.bind(this.gl, this.gl.TEXTURE1);
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