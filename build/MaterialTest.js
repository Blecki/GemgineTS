import { AssetLoader } from "./AssetLoader.js";
import { Camera } from "./Camera.js";
import { Point } from "./Point.js";
import { GameTime } from "./GameTime.js";
import { Fluent } from "./Fluent.js";
import { RenderTarget2D } from "./RenderTarget2D.js";
import { EditorContext, HandleProperties } from "./editor/EditorContext.js";
import { Material } from "./gl/Material.js";
import { Shader } from "./gl/Shader.js";
import { Program } from "./gl/Program.js";
var outerFrame;
var previewCanvas;
var dataLoaded = false;
export function Run(frame) {
    outerFrame = frame;
    const loader = new AssetLoader();
    loader.setupStandardLoaders();
    loader.loadAsset("data/", "3d-render-vertex.glsl")
        .then(vertexShader => {
        loader.loadAsset("data/", "3d-render-fragment.glsl")
            .then(fragmentShader => {
            previewCanvas = Fluent.e('canvas')
                ._modify(c => { let e = c; e.width = 512; e.height = 512; });
            outerFrame.appendChild(previewCanvas);
            let gl = previewCanvas.getContext('webgl');
            let mat = null;
            if (gl) {
                mat = new Material(gl, new Program(vertexShader.asset, fragmentShader.asset));
            }
            console.log(mat);
            dataLoaded = true;
            gameLoop(() => {
            });
        });
    });
}
function gameLoop(frameCallback) {
    GameTime.update();
    if (dataLoaded) {
    }
    frameCallback();
    requestAnimationFrame(() => gameLoop(frameCallback));
}
//# sourceMappingURL=MaterialTest.js.map