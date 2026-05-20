import { AssetStore } from "../AssetStore.js";
import { Node } from "./Node.js";
import { BlankImageNode } from "./textureGen/BlankImageNode.js";
import { BlendNode } from "./textureGen/BlendNode.js";
import { BlitNode } from "./textureGen/BlitNode.js";
import { ColorNode } from "./textureGen/ColorNode.js";
import { DrawLinearGradientNode } from "./textureGen/DrawLinearGradientNode.js";
import { GradientNode } from "./textureGen/GradientNode.js";
import { NoiseNode } from "./textureGen/NoiseNode.js";
import { Output } from "./Output.js";
import { PointNode } from "./textureGen/PointNode.js";
import { RectNode } from "./textureGen/RectNode.js";
import { MultiplyNode } from "./textureGen/MultiplyNode.js";
import { RoundedRectangleNode } from "./textureGen/RoundedRectangleNode.js";
import { NumberNode } from "./textureGen/NumberNode.js";
import { SkewNode } from "./textureGen/SkewNode.js";

type nodeFactory = (assetStore: AssetStore) => Node;
let nodeFactories : Map<string, nodeFactory> = new Map([
  ["BlankImage", (assetStore) => new BlankImageNode(assetStore) as Node],
  ["Blend", (assetStore) => new BlendNode(assetStore) as Node],
  ["Blit", (assetStore) => new BlitNode(assetStore) as Node],
  ["Color", (assetStore) => new ColorNode(assetStore) as Node],
  ["DrawLinearGradient", (assetStore) => new DrawLinearGradientNode(assetStore) as Node],
  ["Gradient", (assetStore) => new GradientNode(assetStore) as Node],
  ["Noise", (assetStore) => new NoiseNode(assetStore) as Node],
  ["Number", (assetStore) => new NumberNode(assetStore) as Node],
  ["Point", (assetStore) => new PointNode(assetStore) as Node],
  ["Rect", (assetStore) => new RectNode(assetStore) as Node],
  ["RoundedRect", (assetStore) => new RoundedRectangleNode(assetStore) as Node],
  ["Multiply", (assetStore) => new MultiplyNode(assetStore) as Node],
  ["Output", (assetStore) => new Output(assetStore) as Node],
  ["Skew", (assetStore) => new SkewNode(assetStore) as Node]
]);

export function createNode(type: string, assetStore: AssetStore) : Node | undefined {
  if (nodeFactories.has(type))
    return nodeFactories.get(type)?.(assetStore);
  else
    return undefined;
}

export function enumerateNodeTypes() : MapIterator<string> {
  return nodeFactories.keys();
}
