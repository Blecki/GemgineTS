import { AssetLoader } from "./AssetLoader.js";
import { RenderModule } from "./RenderModule.js";
import { Engine } from "./Engine.js";
import { EntityBlueprint } from "./EntityBlueprint.js";
import { Entity } from "./Entity.js";
import { loadJSON } from "./JsonLoader.js";
import { TiledWorld, TiledWorldMap } from "./TiledWorld.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { Camera } from "./Camera.js";
import { UpdateModule } from "./UpdateModule.js";
import { Point } from "./Point.js";
import { GfxAsset } from "./GfxAsset.js";
import { AnimationSetAsset, AnimationAsset } from "./AnimationSetAsset.js";
import { Random } from "./Random.js";
import { CollisionModule } from "./CollisionModule.js";
import { RawImage } from "./RawImage.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { PlayerControllerComponent } from "./PlayerControllerComponent.js";
import { BoundsColliderComponent } from "./BoundsColliderComponent.js";
import { TagComponent } from "./TagComponent.js";
import { HealthComponent } from "./HealthComponent.js";
import { GUIHealthBarComponent } from "./GUIHealthBarComponent.js";
import { PhysicsModule } from "./PhysicsModule.js";
import { TilemapColliderComponent } from "./TilemapColliderComponent.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { Rect } from "./Rect.js";
import { GameTime } from "./GameTime.js";
import { Fluent } from "./Fluent.js";
import { RenderTarget2D } from "./RenderTarget2D.js";
import { AnimationPlayer } from "./AnimationPlayer.js";
import { AssetStore } from "./AssetStore.js";
import { AnimationHitBox } from "./AnimationHitBox.js";
import { EditorContext, HandleProperties } from "./editor/EditorContext.js";
import { MouseHandler } from "./MouseHandler.js";
import { PropertyGrid } from "./editor/PropertyGrid.js";
var outerFrame;
var previewCanvas;
var renderTarget;
var cam;
var dataLoaded = false;
var editorContext;
export function Run(frame) {
    outerFrame = frame;
    const loader = new AssetLoader();
    loader.setupStandardLoaders();
    cam = new Camera(new Point(256, 256));
    cam.scale = new Point(4, 4);
    render();
    gameLoop(() => {
    });
}
class NodeTerminal {
    node = null;
    id = 0;
}
class NodeConnection {
    outputTerminal = null;
    inputTerminal = null;
}
class Node {
    rect = new Rect(0, 0, 20, 20);
    inputs = [];
    outputs = [];
    initialize() {
        for (let x = 0; x < this.inputs.length; ++x) {
            this.inputs[x].node = this;
            this.inputs[x].id = x;
        }
        for (let x = 0; x < this.outputs.length; ++x) {
            this.outputs[x].node = this;
            this.outputs[x].id = x;
        }
    }
}
var nodes = [];
var connections = [];
function render() {
    let f = new Fluent();
    let widget = f.div()._append(previewCanvas = f.e('canvas')
        ._modify(c => { let e = c; e.width = 512; e.height = 512; }));
    outerFrame.appendChild(widget);
    renderTarget = new RenderTarget2D(previewCanvas);
    editorContext = new EditorContext(cam, renderTarget);
    var a = new Node();
    a.inputs.push(new NodeTerminal());
    a.inputs.push(new NodeTerminal());
    a.inputs.push(new NodeTerminal());
    a.initialize();
    nodes.push(a);
    var b = new Node();
    b.outputs.push(new NodeTerminal());
    b.outputs.push(new NodeTerminal());
    b.outputs.push(new NodeTerminal());
    b.initialize();
    nodes.push(b);
    var c = new NodeConnection();
    c.inputTerminal = a.inputs[0];
    c.outputTerminal = b.outputs[0];
    connections.push(c);
    dataLoaded = true;
}
var selectedRectangle = -1;
function gameLoop(frameCallback) {
    GameTime.update();
    if (dataLoaded) {
        renderTarget.clearScreen();
        cam.update();
        editorContext.open();
        for (let x = 0; x < nodes.length; ++x) {
            let lcopy_x = x;
            renderTarget.drawRectangle(nodes[x].rect.withOffset(new Point(0, 0)), "lightblue");
            renderTarget.drawWireRectangle(nodes[x].rect.withOffset(new Point(0, 0)), "blue");
            for (let input = 0; input < nodes[x].inputs.length; ++input) {
                let pos = getInputPosition(nodes[x].rect, input);
                editorContext.handleSize = 3;
                editorContext.translateHandle(pos, new HandleProperties(1, 1)).ifDragged(handle => {
                    renderTarget.drawLine(pos, handle.mousePosition, "red");
                });
            }
            for (let output = 0; output < nodes[x].outputs.length; ++output) {
                let pos = getOutputPosition(nodes[x].rect, output);
                editorContext.handleSize = 3;
                editorContext.translateHandle(pos, new HandleProperties(1, 1)).ifDragged(handle => {
                    renderTarget.drawLine(pos, handle.mousePosition, "red");
                });
            }
            editorContext.translateHandle(new Point(nodes[x].rect.x + nodes[x].rect.width / 2, nodes[x].rect.y + 2), new HandleProperties(nodes[x].rect.width, 4)).ifDragged(handle => {
                nodes[lcopy_x].rect.x += handle.delta.x;
                nodes[lcopy_x].rect.y += handle.delta.y;
            });
        }
        for (let x = 0; x < connections.length; ++x) {
            let a = connections[x].inputTerminal;
            let b = connections[x].outputTerminal;
            if (a != null && a.node != null && b != null && b.node != null)
                renderTarget.drawLine(getInputPosition(a.node.rect, a.id), getOutputPosition(b.node.rect, b.id), "greeen");
        }
        editorContext.close();
        renderTarget.flush(cam);
    }
    frameCallback();
    requestAnimationFrame(() => gameLoop(frameCallback));
}
function getInputPosition(rect, input) {
    return new Point(rect.x + 1, rect.y + 6 + (input * 4));
}
function getOutputPosition(rect, input) {
    return new Point(rect.x + rect.width - 2, rect.y + 6 + (input * 4));
}
//# sourceMappingURL=NodeEditor.js.map