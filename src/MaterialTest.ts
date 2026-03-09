import { AssetLoader } from "./AssetLoader.js";
import { Camera } from "./Camera.js";
import { Point } from "./Point.js";
import { GameTime  } from "./GameTime.js";
import { Fluent, type FluentElement } from "./Fluent.js";
import { RenderTarget2D } from "./RenderTarget2D.js";
import { EditorContext, HandleProperties } from "./editor/EditorContext.js";

import { Material } from "./gl/Material.js";
import { Shader } from "./gl/Shader.js";
import { Program } from "./gl/Program.js";

var outerFrame: HTMLElement; 
var previewCanvas: HTMLCanvasElement;
var dataLoaded: boolean = false;

export function Run(frame: HTMLElement) : void {
  outerFrame = frame;

  const loader = new AssetLoader();
  loader.setupStandardLoaders();

  loader.loadAsset("data/", "3d-render-vertex.glsl")
    .then(vertexShader => {
      loader.loadAsset("data/", "3d-render-fragment.glsl")
        .then(fragmentShader => {
          let f = new Fluent();
          previewCanvas = (f.e('canvas')
              ._modify(c => { let e = c as unknown as HTMLCanvasElement; e.width = 512; e.height = 512; }) as unknown as HTMLCanvasElement);
          outerFrame.appendChild(previewCanvas);
          
          let gl = previewCanvas.getContext('webgl');
          let mat: Material | null = null;
          if (gl) {
            mat = new Material(gl, new Program(vertexShader.asset as Shader, fragmentShader.asset as Shader));
          }

          console.log(mat);

          dataLoaded = true;

          gameLoop(() => {
            
            
          
          }); 
        });
    });
}

function gameLoop(frameCallback: () => void) {
  GameTime.update();
  if (dataLoaded) {


  }

  frameCallback();
  requestAnimationFrame(() => gameLoop(frameCallback));
}
