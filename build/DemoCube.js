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
import { Mesh } from "./gl/Mesh.js";
import { Camera3D } from "./gl/Camera3D.js";
import { Vector3Raw } from "./gl/Vector3.js";
import { m4Rotation, m4Multiply } from "./gl/Matrix4x4.js";
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
            let f = new Fluent();
            previewCanvas = f.e('canvas')
                ._modify(c => { let e = c; e.width = 512; e.height = 512; });
            outerFrame.appendChild(previewCanvas);
            let gl = previewCanvas.getContext('webgl');
            let mat = null;
            let mesh = null;
            let cam = new Camera3D();
            cam.position = new Vector3Raw(0, 0, -3);
            if (gl) {
                mat = new Material(gl, new Program(vertexShader.asset, fragmentShader.asset));
                mesh = Mesh.fromVertexList(new Float32Array([
                    -1, -1, 1, 1, -1, 1, 1, 1, 1, -1, 1, 1, // Front
                    -1, -1, -1, -1, 1, -1, 1, 1, -1, 1, -1, -1, // Back
                    -1, 1, -1, -1, 1, 1, 1, 1, 1, 1, 1, -1, // Top
                    -1, -1, -1, 1, -1, -1, 1, -1, 1, -1, -1, 1, // Bottom
                    -1, -1, 1, -1, -1, -1, -1, 1, -1, -1, 1, 1, // Left
                    1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, 1, // Right
                ]), new Uint16Array([
                    0, 1, 2, 0, 2, 3,
                    4, 5, 6, 4, 6, 7,
                    8, 9, 10, 8, 10, 11,
                    12, 13, 14, 12, 14, 15,
                    16, 17, 18, 16, 18, 19,
                    20, 21, 22, 20, 22, 23
                ]));
                mesh.updateBuffer(gl);
                console.log(mesh);
            }
            console.log(mat);
            dataLoaded = true;
            let cubeRotation = 0;
            gameLoop(() => {
                if (gl && mat && mesh) {
                    cubeRotation += 0.01;
                    gl.clearColor(0, 0, 0, 1);
                    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
                    gl.enable(gl.DEPTH_TEST);
                    let rotation = m4Rotation(cubeRotation, new Vector3Raw(0, 1, 0));
                    mat.setUniform("uModelViewMatrix", m4Multiply(cam.getViewMatrix(), rotation));
                    mat.setUniform("uProjectionMatrix", cam.getProjectionMatrix(512, 512));
                    mat.bind();
                    mat.setAttribImmediate("aVertexPosition", mesh.positionBuffer);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
                    gl.drawElements(gl.TRIANGLES, 36, gl.UNSIGNED_SHORT, 0);
                }
            });
        });
    });
}
function gameLoop(frameCallback) {
    GameTime.update();
    frameCallback();
    requestAnimationFrame(() => gameLoop(frameCallback));
}
//# sourceMappingURL=DemoCube.js.map