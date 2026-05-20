import { type Vector3 } from "../gl/Vector3.js";
import { type Vector2, Vector2Raw } from "../gl/Vector2.js";

export type ShadeFunction = (uv: Vector2) => Vector3; 

export function putPixel(image: ImageData, x: number, y: number, color: Vector3) {
  let pixels = image.data;
  const index = (x + y * image.width) * 4;
  pixels[index] = color.x;
  pixels[index + 1] = color.y;
  pixels[index + 2] = color.z;
  pixels[index + 3] = 255;
}

export function fullShade(image: ImageData, shader: ShadeFunction) : void {
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

export function fill(image: ImageData, color: Vector3) : void {
  fullShade(image, (uv) => color);
}
