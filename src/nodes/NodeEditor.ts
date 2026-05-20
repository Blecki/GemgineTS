import { AssetLoader } from "../AssetLoader.js";
import { Camera } from "../Camera.js";
import { Point } from "../Point.js";
import { Rect } from "../Rect.js";
import { GameTime  } from "../GameTime.js";
import { Fluent, type FluentElement } from "../Fluent.js";
import { RenderTarget2D } from "../RenderTarget2D.js";
import { EditorContext, HandleProperties } from "../editor/EditorContext.js";
import { Node } from "./Node.js";
import { createNode, enumerateNodeTypes } from "./NodeFactory.js";
import { NodeSet } from "./NodeSet.js";
import { AssetStore } from "../AssetStore.js";
import { GuiAssets } from "./GuiAssets.js";

export class NodeEditor {

  public previewCanvas: HTMLCanvasElement;
  public renderTarget: RenderTarget2D;
  public cam: Camera;
  public guiCam: Camera;
  public dataLoaded: boolean = false;
  public editorContext: EditorContext;
  public guiEditorContext: EditorContext;
  public nodeSet: NodeSet = new NodeSet();
  private showContextMenu: boolean = false;
  private store: AssetStore;
  private contextMenuCenter: Point = new Point(0,0);
  private guiAssets: GuiAssets;
  private updateQueue: Node[] = []
 
  constructor() {

    const loader = new AssetLoader();
    loader.setupStandardLoaders();
    this.store = new AssetStore("data/", null, loader);
    this.guiAssets = new GuiAssets(this.store);
    
    this.cam = new Camera(new Point(256, 256));
    this.cam.scale = new Point(1,1);

    this.guiCam = new Camera(new Point(256, 256));
    this.guiCam.scale = new Point(1,1);

    this.previewCanvas = Fluent.e('canvas')._style({width: "100%", height: "100%", border: "2px solid red"}) as unknown as HTMLCanvasElement;
    this.previewCanvas.addEventListener("contextmenu", (e) => {
      e.preventDefault();
      this.showContextMenu = true;
      let brect = this.previewCanvas.getBoundingClientRect();
      let pos = this.guiCam.screenToWorld(new Point(e.clientX - brect.x, e.clientY - brect.y));
      this.contextMenuCenter = pos;
    });

    this.renderTarget = new RenderTarget2D(this.previewCanvas);
    this.editorContext = new EditorContext(this.cam, this.renderTarget, this.store);

    this.guiEditorContext = new EditorContext(this.guiCam, this.renderTarget, this.store);

    var a = createNode("Output", this.store);
    if (a != undefined) {
      this.nodeSet.nodes.push(a);
      this.updateQueue.push(a);

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
        if (this.updateQueue.length > 0) {
          let node = this.updateQueue.shift();
          try {
            node?.Process((node) => this.enqueueUpdate(node));
          } catch (error) {
            console.log(error);
          }
        }
      }); 
    }
  }

  public enqueueUpdate(node: Node) {
    this.updateQueue.push(node);
  }

  public createNewNode(clientX: number, clientY: number, node: Node) {
    node.rect.x = clientX;
    node.rect.y = clientY;
    this.nodeSet.nodes.push(node);
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
        this.nodeSet.nodes[x].draw(this.renderTarget, this.editorContext, this.nodeSet, this.guiAssets, (node) => this.enqueueUpdate(node));  
      }

      for (let x = 0; x < this.nodeSet.connections.length; ++x) {
        let a = this.nodeSet.connections[x].startTerminal;
        let b = this.nodeSet.connections[x].endTerminal;
        if (a != null && a.node != null && b != null && b.node != null)
          this.renderTarget.drawCurveWidth(a.anchorPoint, a.anchorPoint.add(new Point(100, 0)), b.anchorPoint.add(new Point(-100, 0)), b.anchorPoint, "green", 3);
      } 

      this.renderTarget.flush(this.cam);
      this.editorContext.close();
      this.renderTarget.flush(this.cam);

      if (this.editorContext.mouseDrag.handled == false && this.editorContext.mouseDown.altHeld == true) {
        this.cam.position = this.cam.position.sub(this.editorContext.mouseDrag.mouseDelta);
      }

      this.guiCam.canvasSize = new Point(this.previewCanvas.width, this.previewCanvas.height);
      this.guiCam.moveCameraTeleport(new Point(this.previewCanvas.width / 2, this.previewCanvas.height / 2));
      this.guiCam.update();
      this.guiEditorContext.open();

      // Draw GUI
      this.guiEditorContext.widget(new Rect(this.previewCanvas.width - 64, 32, 32, 32), { image: this.guiAssets.saveIcon }).ifMouseDown(e => {
        let data = JSON.stringify(this.nodeSet.serialize(), null, 2);
        let blob = new Blob([data], {type: "text/plain" });
        let url = URL.createObjectURL(blob);
        let anchor = document.createElement('a');
        anchor.href = url;
        anchor.download = 'nodes.txt';
        document.body.appendChild(anchor);
        anchor.click();
        document.body.removeChild(anchor);
        URL.revokeObjectURL(url);
        e.handled = true;
      });

      this.guiEditorContext.widget(new Rect(this.previewCanvas.width - 64, 80, 32, 32), { image: this.guiAssets.loadIcon }).ifMouseDown(e => {
        let fileInput : HTMLInputElement | null = null;
        let modal : FluentElement | null = null;
        document.documentElement.appendChild(
          modal = Fluent.div()._class('modal')._append(
            Fluent.div()._class('modal-content')._append(
              fileInput = Fluent.input('file') as unknown as HTMLInputElement,
              Fluent.button()._handler('click', () => {
                let file = fileInput?.files?.[0];
                if (file) {
                  const reader = new FileReader();
                  reader.onload = (e: ProgressEvent<FileReader>) => {
                    const jsonContent = e.target?.result as string;
                    const data : object = JSON.parse(jsonContent);
                    console.log(data);                    
                    this.nodeSet.deserialize(data, (nodeType) => { return createNode(nodeType, this.store); });
                    if (modal) modal.remove();
                  };

                  reader.onerror = (error) => { window.alert(error); };

                  reader.readAsText(file);
                }
              })._append("Load"),
              Fluent.button()._handler('click', () => {
                if (modal != null) modal.remove();
              })._append("Cancel")
            )
          )
        );
        e.handled = true;
      });

      this.guiEditorContext.widget(new Rect(this.previewCanvas.width - 64, 128, 32, 32), { image: this.guiAssets.zoomInIcon }).ifMouseDown(e => {
        this.cam.scale = new Point(this.cam.scale.x * 1.1, this.cam.scale.y * 1.1);
        e.handled = true;
      });

      this.guiEditorContext.widget(new Rect(this.previewCanvas.width - 64, 176, 32, 32), { image: this.guiAssets.zoomOutIcon }).ifMouseDown(e => {
        this.cam.scale = new Point(this.cam.scale.x / 1.1, this.cam.scale.y / 1.1);
        e.handled = true;
      });

      const itemsPerLayer = 8;     // Max buttons in the inner ring
      const initialRadius = 150;   // Distance of the first ring from center
      const layerSpacing = 60;     // Additional distance for each new ring


      if (this.showContextMenu) {
        const nodeTypes = Array.from(enumerateNodeTypes()); // Convert to array to get index
        
        nodeTypes.forEach((nodeType, i) => {
          // 1. Find which ring and position in ring
          const layer = Math.floor(i / itemsPerLayer);
          const indexInLayer = i % itemsPerLayer;
          
          // 2. Calculate dynamic distance and angle
          const radius = initialRadius + (layer * layerSpacing);
          const angle = (indexInLayer / itemsPerLayer) * 2 * Math.PI;

          // 3. Convert Polar to Cartesian coordinates (Relative to center)
          const x = this.contextMenuCenter.x + radius * Math.cos(angle) - (128 / 2);
          const y = this.contextMenuCenter.y + radius * Math.sin(angle) - (32 / 2);

          let rect = new Rect(x, y, 128, 32);
          
          this.guiEditorContext.widget(rect, { text: nodeType }).ifMouseDown(w => {
            let newNode = createNode(nodeType, this.store);
            if (newNode !== undefined) {
              let worldPos = this.cam.screenToWorld(this.guiCam.worldPointToScreen(this.contextMenuCenter));
              this.createNewNode(worldPos.x, worldPos.y, newNode);
            }
            this.showContextMenu = false;
            w.handled = true;
          });
        });
      }

      if (this.guiEditorContext.mouseDown.triggered && !this.guiEditorContext.mouseDown.handled) this.showContextMenu = false;
      this.renderTarget.flush(this.guiCam);
      this.guiEditorContext.close();

      frameCallback();
    }

    requestAnimationFrame(() => this.gameLoop(frameCallback));
  }
}

