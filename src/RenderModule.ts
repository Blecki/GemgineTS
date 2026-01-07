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
  public renderLayer: number = RenderLayers.Background;
  public renderChannel: number = RenderChannels.Diffuse;
  public render(context: RenderContext):void { /* Default implementation */ }
}

interface RenderableComponent {
  renderLayer: number;
  renderChannel: number;
  render(context: RenderContext):void;
}

interface AnimateableComponent {
  animate(): void;
}

@componentType("DebugGizmo")
export class DebugGizmoComponent extends RenderComponent {  
  private point: ImageBitmap | null = null;
  public initialize(engine: Engine, template: TiledTemplate, prototypeAsset: AssetReference) 
  {
    this.point = engine.getAsset("assets/point.png").asset;
    this.renderLayer = RenderLayers.Objects;
    this.renderChannel = RenderChannels.Diffuse;
  }  
  public render(context: RenderContext): void {
    /*
    if (this.parent != null) {
      var ctx = context.getTarget(RenderLayers.Objects, RenderChannels.Diffuse);
      ctx.drawRectangle(this.parent.globalBounds, 'rgba(255, 0, 0, 0.5)');
      if (this.point != null)
        ctx.drawImage(this.point, new Rect(0, 0, this.point.width, this.point.height), new Point(this.parent.globalPosition.x - 2, this.parent.globalPosition.y - 2));
    }
    */
  }
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
  private program: WebGLProgram | null = null;
  private paralax: Texture | null = null;

  private readonly LightZ: number = 64;

  constructor(canvas: HTMLCanvasElement) {
    super();
    this.destinationCanvas = canvas;
    let ctx = this.destinationCanvas.getContext('webgl2');
    if (ctx == null) throw new Error("Failed to get WebGL context");
    this.gl = ctx;

    this.renderContext = new RenderContext(this.destinationCanvas.width, this.destinationCanvas.height, this.gl);
  }

  public engineStart(engine: Engine): void {
    const vertexShader = (engine.getAsset("final-composite-vertex.glsl").asset as Shader).compile(this.gl, this.gl.VERTEX_SHADER);
    const fragmentShader = (engine.getAsset("final-composite-fragment.glsl").asset as Shader).compile(this.gl, this.gl.FRAGMENT_SHADER);

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

    let tex = engine.getAsset("assets/paralax.png").asset;
    console.log(tex);
    this.paralax = new Texture(engine.getAsset("assets/paralax.png").asset as ImageBitmap, this.gl);

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

    // Render scene to buffers

    this.animatables.forEach(a => a.animate());

    this.renderContext.prepAll();
    
    if (this.camera == null) return;
        for (let renderable of this.renderables) {
          renderable.render(this.renderContext);
        }

    this.fpsQueue.push(GameTime.getDeltaTime());
    if (this.fpsQueue.length > 200) this.fpsQueue.shift();
    var objectDiffuse = this.renderContext.getTarget(RenderLayers.Objects, RenderChannels.Diffuse);
    let averageFrameTime = this.fpsQueue.reduce((sum, val) => sum + val, 0) / this.fpsQueue.length;
    let fps = Math.round(1 / averageFrameTime).toString();
    objectDiffuse.drawString(fps, new Point(5, 5), 'white');

    this.renderContext.flushAll(this.camera);


    // Composite buffers onto screen.

    this.gl.clear(this.gl.COLOR_BUFFER_BIT | this.gl.DEPTH_BUFFER_BIT);

    if (this.program != null) {
      this.gl.uniform2fv(this.gl.getUniformLocation(this.program, 'u_screenDimensions'), [this.destinationCanvas.width, this.destinationCanvas.height]);

      this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_diffuse"), 0); 
      this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_objects"), 1); 
      this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_height"), 2); 
      this.gl.uniform1i(this.gl.getUniformLocation(this.program, "u_paralax"), 3);

      this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Diffuse).bind(this.gl, this.gl.TEXTURE0);
      objectDiffuse.bind(this.gl, this.gl.TEXTURE1);
      this.renderContext.getTarget(RenderLayers.Background, RenderChannels.Normals).bind(this.gl, this.gl.TEXTURE2);
      this.paralax?.bind(this.gl, this.gl.TEXTURE3);

      let localLights = this.lights.map(lc => {
        return new Light(
          (lc.parent?.globalPosition.add(lc.offset).add(this.camera?.drawOffset ?? new Point(0, 0))) ?? new Point(0, 0),
          lc.radius,
          lc.color,
          lc.intensity);
        });

        console.log(localLights);
      
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