import { Component } from "./Component.js";
import { Module } from "./Module.js";
import { RenderContext } from "./RenderContext.js";
import { Entity } from "./Entity.js";
import { Camera } from "./Camera.js";
import { Engine } from "./Engine.js";
import { GameTime } from "./GameTime.js";
import { RenderLayers } from "./RenderLayers.js";
import { Point } from "./Point.js";
import { LightComponent } from "./LightComponent.js";
import { Color } from "./Color.js";
import { Shader } from "./Shader.js";

export class RenderComponent extends Component {
  public renderLayer: number = RenderLayers.BackgroundDiffuse;
  public render(context: RenderContext):void { /* Default implementation */ }
}

interface RenderableComponent {
  renderLayer: number;
  render(context: RenderContext):void;
}

interface AnimateableComponent {
  animate(): void;
}

class Light {
  public screenPosition: Point;
  public radius: number;
  public color: Color;
  public intensity: number;

  constructor(screenPosition: Point, radius: number, color: Color, intensity: number) {
    this.screenPosition = screenPosition;
    this.radius = radius;
    this.color = color;
    this.intensity = intensity;
  }
}

export class RenderModule extends Module {
  private readonly renderables: RenderableComponent[] = [];
  private readonly animatables: AnimateableComponent[] = [];
  private readonly lights: LightComponent[] = [];

  public camera: Camera | null = null;
  
  public fpsQueue: number[] = [];
  public destinationCanvas: HTMLCanvasElement;
  public gl: WebGL2RenderingContext;
  public renderContext: RenderContext;
  private worldCompositeProgram: WebGLProgram | null = null;
  private guiCompositeProgram: WebGLProgram | null = null;
  private guiCamera: Camera;
  private readonly LightZ: number = 64;
  private fullScreenQuadBuffer: WebGLBuffer | null = null;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.destinationCanvas = canvas;
    let ctx = this.destinationCanvas.getContext('webgl2');
    if (ctx == null) throw new Error("Failed to get WebGL context");
    this.gl = ctx;

    this.renderContext = new RenderContext(this.destinationCanvas.width, this.destinationCanvas.height, this.gl);
    this.guiCamera = new Camera(new Point(this.destinationCanvas.width, this.destinationCanvas.height));
    //this.guiCamera.drawOffset = new Point(-this.destinationCanvas.width / 2, -this.destinationCanvas.height / 2); // Position 0,0 at the top left.
  }

  public engineStart(engine: Engine): void {

    const vertexShader = (engine.assets.getPreloadedAsset("final-composite-vertex.glsl").asset as Shader).compile(this.gl, this.gl.VERTEX_SHADER);
    const fragmentShader = (engine.assets.getPreloadedAsset("final-composite-fragment.glsl").asset as Shader).compile(this.gl, this.gl.FRAGMENT_SHADER);
    this.worldCompositeProgram = this.compileProgram(this.gl, vertexShader, fragmentShader);

    const guiFragmentShader = (engine.assets.getPreloadedAsset("gui-composite-fragment.glsl").asset as Shader).compile(this.gl, this.gl.FRAGMENT_SHADER);
    this.guiCompositeProgram = this.compileProgram(this.gl, vertexShader, guiFragmentShader);

    this.fullScreenQuadBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.fullScreenQuadBuffer);

    const positions = new Float32Array([
      -1.0, -1.0,
      1.0, -1.0,
      -1.0, 1.0,
      1.0, 1.0
    ]);

    this.gl.bufferData(this.gl.ARRAY_BUFFER, positions, this.gl.STATIC_DRAW);
  }
  
  private isRenderable(object: any): object is RenderableComponent {
    return 'render' in object;
  }

  private isAnimatable(object: any): object is AnimateableComponent {
    return 'animate' in object;
  }

  private isLight(object: any): object is LightComponent {
    return 'offset' in object && 'radius' in object && 'color' in object && 'intensity' in object;
  }

  entityCreated(entity: Entity) {
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

  render(engine: Engine) {

    if (this.camera == null) return;

    this.animatables.forEach(a => a.animate());
    this.renderContext.prepAll();
    
    for (let renderable of this.renderables) {
      renderable.render(this.renderContext);
    }

    this.fpsQueue.push(GameTime.getDeltaTime());
    if (this.fpsQueue.length > 200) this.fpsQueue.shift();
    var gui = this.renderContext.getTarget(RenderLayers.GUI);
    let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
    let fps = Math.round(1 / averageFrameTime).toString();
    gui.drawString(fps, new Point(5, 5), 'black');

    this.renderContext.flushAll(this.camera, this.guiCamera);

    // Composite buffers onto screen.

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);
    this.gl.disable(this.gl.DEPTH_TEST);

    if (this.worldCompositeProgram != null) {

      this.gl.useProgram(this.worldCompositeProgram);
      this.gl.disable(this.gl.BLEND);

      const positionLocation = this.gl.getAttribLocation(this.worldCompositeProgram, "a_position");
      this.gl.enableVertexAttribArray(positionLocation);
      this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.fullScreenQuadBuffer);

      this.gl.uniform1i(this.gl.getUniformLocation(this.worldCompositeProgram, "u_background_diffuse"), 0); 
      this.renderContext.getTarget(RenderLayers.BackgroundDiffuse).bind(this.gl, this.gl.TEXTURE0);
      this.gl.uniform1i(this.gl.getUniformLocation(this.worldCompositeProgram, "u_objects_diffuse"), 1); 
      this.renderContext.getTarget(RenderLayers.ObjectsDiffuse).bind(this.gl, this.gl.TEXTURE1);

      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }    

    if (this.guiCompositeProgram != null) {

      this.gl.useProgram(this.guiCompositeProgram);
      this.gl.enable(this.gl.BLEND);
      this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA);
      const positionLocation = this.gl.getAttribLocation(this.guiCompositeProgram, "a_position");
      this.gl.enableVertexAttribArray(positionLocation);
      this.gl.vertexAttribPointer(positionLocation, 2, this.gl.FLOAT, false, 0, 0);
      this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.fullScreenQuadBuffer);

      this.gl.uniform1i(this.gl.getUniformLocation(this.guiCompositeProgram, "u_gui"), 0); 
      this.renderContext.getTarget(RenderLayers.GUI).bind(this.gl, this.gl.TEXTURE0);

      this.gl.drawArrays(this.gl.TRIANGLE_STRIP, 0, 4);
    }    
  }

  setCamera(camera: Camera) {
    this.camera = camera;
  }

  compileProgram(context: WebGLRenderingContext, vertexShader: WebGLShader | null, fragmentShader: WebGLShader | null): WebGLProgram | null{
    const program = context.createProgram();
    if (vertexShader != null) context.attachShader(program, vertexShader);
    if (fragmentShader != null) context.attachShader(program, fragmentShader);
    context.linkProgram(program);

    if (!context.getProgramParameter(program, context.LINK_STATUS)) {
      throw new Error(`Failed to compile WebGL program: ${context.getProgramInfoLog(program)}`);
    }

    return program;
  }
}