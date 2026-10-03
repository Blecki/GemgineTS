import { AssetLoader } from "../AssetLoader.js";
import { GameTime  } from "../GameTime.js";
import { Vector3Raw, type Vector3 } from "../gl/Vector3.js";
import { type Vector2, Vector2Raw } from "../gl/Vector2.js";
import { TilingPerlin } from "../PerlinNoise.js";
import { NodeEditor } from "../nodes/NodeEditor.js";

var outerFrame: HTMLElement; 
var editor: NodeEditor;

type ShadeFunction = (uv: Vector2) => Vector3; 

function putPixel(image: ImageData, x: number, y: number, color: Vector3) {
  let pixels = image.data;
  const index = (x + y * image.width) * 4;
  pixels[index] = color.x;
  pixels[index + 1] = color.y;
  pixels[index + 2] = color.z;
  pixels[index + 3] = 255;
}

function fullShade(image: ImageData, shader: ShadeFunction) : void {
  let pixels = image.data;
  for (let i = 0; i < pixels.length; i += 4) {
    let u = Math.floor((i % (image.width * 4)) / 4) / image.width;
    let v = Math.floor(i / (image.width * 4)) / image.height;
    let color = shader(new Vector2Raw(u, v));
    pixels[i] = color.x;
    pixels[i+1] = color.y;
    pixels[i+2] = color.z;
    pixels[i+3] = 255;
  }
}

function Fill(image: ImageData, color: Vector3) : void {
 fullShade(image, (uv) => color);
}

function noise(at: Vector2, perlin: TilingPerlin) : Vector3 {
  let noise = perlin.get(at.x, at.y, 16, 16);
  return new Vector3Raw((noise + 1) * 128, (noise + 1) * 128, (noise + 1) * 128);
}

export function Run(frame: HTMLElement) : void {
  outerFrame = frame;

  const loader = new AssetLoader();
  loader.setupStandardLoaders();

  editor = new NodeEditor();
  outerFrame.appendChild(editor.previewCanvas);
        
  gameLoop(() => {

  }); 
}

function gameLoop(frameCallback: () => void) {
  GameTime.update();
  frameCallback();
  requestAnimationFrame(() => gameLoop(frameCallback));
}
