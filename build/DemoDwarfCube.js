import { AssetLoader } from "./AssetLoader.js";
import { Camera } from "./Camera.js";
import { Point } from "./Point.js";
import { GameTime } from "./GameTime.js";
import { Fluent } from "./Fluent.js";
import { RenderTarget2D } from "./RenderTarget2D.js";
import { EditorContext, HandleProperties } from "./editor/EditorContext.js";
import { loadJSON } from "./JsonLoader.js";
import { AssetStore } from "./AssetStore.js";
import { Material } from "./gl/Material.js";
import { Shader } from "./gl/Shader.js";
import { Program } from "./gl/Program.js";
import { Mesh } from "./gl/Mesh.js";
import { Camera3D } from "./gl/Camera3D.js";
import { Vector3Raw } from "./gl/Vector3.js";
import { m4Rotation, m4Multiply } from "./gl/Matrix4x4.js";
import { Texture } from "./gl/Texture.js";
var outerFrame;
var previewCanvas;
var dataLoaded = false;
export function Run(frame) {
    outerFrame = frame;
    previewCanvas = Fluent.e('canvas')
        ._modify(c => { let e = c; e.width = 512; e.height = 512; });
    outerFrame.appendChild(previewCanvas);
    // Show loading screen??
    console.log("Starting Engine....");
    loadJSON("data/", "manifest.json")
        .then(asset => {
        let manifest = asset.asset;
        console.log("Loading Assets....");
        const loader = new AssetLoader();
        loader.setupStandardLoaders();
        loader.loadAssets("data/", manifest, (assets) => {
            console.log("Done Loading. Initializing....");
            var assetStore = new AssetStore("data/", assets, loader);
            var vertexShader = assetStore.getPreloadedAsset("3d-render-vertex.glsl");
            var fragmentShader = assetStore.getPreloadedAsset("3d-render-fragment.glsl");
            var gfx = assetStore.getPreloadedAsset("assets/dwarf.gfx").asset;
            gfx.loadImageCache(assetStore);
            var texture = gfx.getCachedImage();
            let gl = previewCanvas.getContext('webgl');
            let mat = null;
            let mesh = null;
            let cam = new Camera3D();
            cam.position = new Vector3Raw(0, 0, -3);
            if (gl && texture) {
                mat = new Material(gl, new Program(vertexShader.asset, fragmentShader.asset));
                var tex = new Texture(gl, texture);
                mat.setUniform("u_texture", tex);
                mesh = Mesh.fromVertexList(new Float32Array([
                    -1, -1, 1, 1, 1, -1, 1, 1, 1, 1, 1, 1, -1, 1, 1, 1, // Front
                    -1, -1, -1, 1, -1, 1, -1, 1, 1, 1, -1, 1, 1, -1, -1, 1, // Back
                    -1, 1, -1, 1, -1, 1, 1, 1, 1, 1, 1, 1, 1, 1, -1, 1, // Top
                    -1, -1, -1, 1, 1, -1, -1, 1, 1, -1, 1, 1, -1, -1, 1, 1, // Bottom
                    -1, -1, 1, 1, -1, -1, -1, 1, -1, 1, -1, 1, -1, 1, 1, 1, // Left
                    1, -1, 1, 1, 1, -1, -1, 1, 1, 1, -1, 1, 1, 1, 1, 1, // Right
                ]), new Uint16Array([
                    0, 1, 2, 0, 2, 3,
                    4, 5, 6, 4, 6, 7,
                    8, 9, 10, 8, 10, 11,
                    12, 13, 14, 12, 14, 15,
                    16, 17, 18, 16, 18, 19,
                    20, 21, 22, 20, 22, 23
                ]), new Float32Array([
                    0, 0, 1, 0, 1, 1, 0, 1, // Front
                    0, 0, 1, 0, 1, 1, 0, 1, // Back
                    0, 0, 1, 0, 1, 1, 0, 1, // Top
                    0, 0, 1, 0, 1, 1, 0, 1, // Bottom
                    0, 0, 1, 0, 1, 1, 0, 1, // Left
                    0, 0, 1, 0, 1, 1, 0, 1, // Right
                ]));
                mesh.updateBuffer(gl);
            }
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
                    mat.setAttribImmediate("aTexcoord", mesh.uvBuffer);
                    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, mesh.indexBuffer);
                    gl.drawElements(gl.TRIANGLES, mesh.indices.length, gl.UNSIGNED_SHORT, 0);
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
//# sourceMappingURL=DemoDwarfCube.js.map