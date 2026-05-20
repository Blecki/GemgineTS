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
let nodeFactories = new Map([
    ["BlankImage", (assetStore) => new BlankImageNode(assetStore)],
    ["Blend", (assetStore) => new BlendNode(assetStore)],
    ["Blit", (assetStore) => new BlitNode(assetStore)],
    ["Color", (assetStore) => new ColorNode(assetStore)],
    ["DrawLinearGradient", (assetStore) => new DrawLinearGradientNode(assetStore)],
    ["Gradient", (assetStore) => new GradientNode(assetStore)],
    ["Noise", (assetStore) => new NoiseNode(assetStore)],
    ["Number", (assetStore) => new NumberNode(assetStore)],
    ["Point", (assetStore) => new PointNode(assetStore)],
    ["Rect", (assetStore) => new RectNode(assetStore)],
    ["RoundedRect", (assetStore) => new RoundedRectangleNode(assetStore)],
    ["Multiply", (assetStore) => new MultiplyNode(assetStore)],
    ["Output", (assetStore) => new Output(assetStore)],
    ["Skew", (assetStore) => new SkewNode(assetStore)]
]);
export function createNode(type, assetStore) {
    if (nodeFactories.has(type))
        return nodeFactories.get(type)?.(assetStore);
    else
        return undefined;
}
export function enumerateNodeTypes() {
    return nodeFactories.keys();
}
//# sourceMappingURL=NodeFactory.js.map