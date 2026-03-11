import { AssetLoader } from "../AssetLoader.js";
import { Camera } from "../Camera.js";
import { Point } from "../Point.js";
import { Rect } from "../Rect.js";
import { GameTime  } from "../GameTime.js";
import { Fluent, type FluentElement } from "../Fluent.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { Node } from "./Node.js";
import { Output } from "./textureGen/Output.js";
import { BlankImage } from "./textureGen/BlankImage.js";
import { Rectangle } from "./textureGen/Rectangle.js";
import { NodeSet } from "./NodeSet.js";
import { Noise } from "./textureGen/Noise.js";
import { LinearGradientNode } from "./textureGen/LinearGradientNode.js";
import { WeirdGradientNode } from "./textureGen/WeirdGradientNode.js";
import { Blend } from "./textureGen/Blend.js";
export class NodeEditor {

  public previewCanvas: HTMLCanvasElement;
  public renderTarget: RenderTarget2D;
  public cam: Camera;
  public dataLoaded: boolean = false;
  public editorContext: EditorContext;
  public nodeSet: NodeSet = new NodeSet();
  private contextMenu: FluentElement | null = null;  

  constructor() {

    const loader = new AssetLoader();
    loader.setupStandardLoaders();
    
    this.cam = new Camera(new Point(256, 256));
    this.cam.scale = new Point(1,1);

    this.previewCanvas = Fluent.e('canvas')._style({width: "100%", height: "100%", border: "2px solid red"}) as unknown as HTMLCanvasElement;
    this.previewCanvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.showContextMenu(e.clientX, e.clientY);
    });

    this.previewCanvas.addEventListener("click", () => { this.contextMenu?.remove(); this.contextMenu = null; });
    
    this.renderTarget = new RenderTarget2D(this.previewCanvas);
    this.editorContext = new EditorContext(this.cam, this.renderTarget);

    var a = new Output();
    this.nodeSet.nodes.push(a);

    this.dataLoaded = true;
    
    window.addEventListener('resize', () => {
      this.previewCanvas.width = this.previewCanvas.clientWidth;// * window.devicePixelRatio;
      this.previewCanvas.height = this.previewCanvas.clientHeight;// * window.devicePixelRatio;
    });

    window.addEventListener('load', () => {
      this.previewCanvas.width = this.previewCanvas.clientWidth;// * window.devicePixelRatio;
      this.previewCanvas.height = this.previewCanvas.clientHeight;// * window.devicePixelRatio;
    });

    this.gameLoop(() => {
      
      
    
    }); 
  }

  public createNewNode(clientX: number, clientY: number, node: Node) {
    let brect = this.previewCanvas.getBoundingClientRect();
    let pos = this.cam.screenToWorld(new Point(clientX - brect.x, clientY - brect.y));
    node.rect.x = pos.x;
    node.rect.y = pos.y;
    this.nodeSet.nodes.push(node);
  }

  public showContextMenu(x: number, y: number) {
    this.contextMenu?.remove();
    let f = new Fluent();
    this.contextMenu = Fluent.div()._append(
      Fluent.button()._append("BLANK")._handler('click', (e) => {
        this.contextMenu?.remove();
        this.createNewNode(e.clientX, e.clientY, new BlankImage());
      }),
      Fluent.button()._append("RECT")._handler('click', (e) => {
        this.contextMenu?.remove();
        this.createNewNode(e.clientX, e.clientY, new Rectangle());
      }),
      Fluent.button()._append("NOISE")._handler('click', (e) => {
        this.contextMenu?.remove();
        this.createNewNode(e.clientX, e.clientY, new Noise());
      }),
      Fluent.button()._append("GRADIENT")._handler('click', (e) => {
        this.contextMenu?.remove();
        this.createNewNode(e.clientX, e.clientY, new LinearGradientNode());
      }),
      Fluent.button()._append("WEIRD")._handler('click', (e) => {
        this.contextMenu?.remove();
        this.createNewNode(e.clientX, e.clientY, new WeirdGradientNode());
      }),
      Fluent.button()._append("BLEND")._handler('click', (e) => {
        this.contextMenu?.remove();
        this.createNewNode(e.clientX, e.clientY, new Blend());
      })
    )._style({
      position: "absolute",
      zIndex: 1000,
      display: "block",
      left: x,
      top: y
    });
    document.documentElement.appendChild(this.contextMenu);
  }

  public selectedRectangle = -1;

  public gameLoop(frameCallback: () => void) {
    GameTime.update();
    if (this.dataLoaded) {
      this.cam.canvasSize = new Point(this.previewCanvas.width, this.previewCanvas.height);
      this.renderTarget.clearScreen();
      this.cam.update();
      this.editorContext.open();

      for (let x = 0; x < this.nodeSet.nodes.length; ++x) {
        this.nodeSet.nodes[x].draw(this.renderTarget, this.editorContext, this.nodeSet);  
      }

      for (let x = 0; x < this.nodeSet.connections.length; ++x) {
        let a = this.nodeSet.connections[x].startTerminal;
        let b = this.nodeSet.connections[x].endTerminal;
        if (a != null && a.node != null && b != null && b.node != null)
          this.renderTarget.drawLineWidth(a.anchorPoint, b.anchorPoint, "green", 3);
      } 

      this.editorContext.close();


      this.renderTarget.flush(this.cam);
    }

    frameCallback();
    requestAnimationFrame(() => this.gameLoop(frameCallback));
  }

}
