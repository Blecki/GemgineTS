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
import { Shader } from "./Shader.js";
import { TilemapColliderComponent } from "./TilemapColliderComponent.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { Rect } from "./Rect.js";
import { GameTime } from "./GameTime.js";
import { Fluent } from "./Fluent.js";
import { RenderTarget } from "./RenderTarget.js";
import { AnimationPlayer } from "./AnimationPlayer.js";
import { AssetStore } from "./AssetStore.js";
import { AnimationHitBox } from "./AnimationHitBox.js";
import { EditorContext } from "./EditorContext.js";
import { EditorGizmo } from "./EditorGizmo.js";
import { MouseHandler } from "./MouseHandler.js";
var outerFrame;
var previewCanvas;
var renderTarget;
var animationPlayer;
var animation;
var cam;
var mainContext;
var dataLoaded = false;
var frameSlider;
var animSelector;
var editorContext = new EditorContext();
var mouseHandler;
export function Run(frame) {
    outerFrame = frame;
    const loader = new AssetLoader();
    loader.setupStandardLoaders();
    const store = new AssetStore("data/", null, loader);
    let test = store.loadAsset("assets/player/player.animset");
    test.then(asset => render(asset.asset));
    cam = new Camera(new Point(48, 64));
    gameLoop(() => {
    });
}
function render(animSet) {
    let f = new Fluent();
    animation = animSet.animations[0];
    let widget = f.div()._append(f.div()._append(animSelector = f.e('select')._append(...animSet.animations.map((a, i) => f.e('option')._append(a.name)._modify(oz => oz.value = i)))
        ._handler('change', () => {
        animation = animSet.animations[Number(animSelector.value)];
        frameSlider.max = `${animation.frames.length - 1}`;
    }), frameSlider = f.input('range')._modify(f => {
        let e = f;
        e.step = "1";
        e.min = "0";
        e.max = `${animation.frames.length - 1}`;
    }), f.button()._append("+")
        ._handler('click', () => {
        let frame = animation.frames[Number(frameSlider.value)];
        frame.hitBoxes.push(new AnimationHitBox({ x: 4, y: 4, width: 16, height: 16 }));
    }), f.button()._append("X")), previewCanvas = f.e('canvas')
        ._modify(c => { let e = c; e.width = 256; e.height = 256; }));
    outerFrame.appendChild(widget);
    mainContext = previewCanvas.getContext('2d');
    renderTarget = new RenderTarget(256, 256, null);
    animationPlayer = new AnimationPlayer(animation.frames.length, animation.fps, true, 0);
    previewCanvas.style.imageRendering = 'pixelated';
    if (mainContext != null)
        mainContext.imageSmoothingEnabled = false;
    mouseHandler = new MouseHandler(previewCanvas);
    dataLoaded = true;
}
var lastDragHandle = 0;
function dragHandle(id, position, renderTarget, cam) {
    let handleBounds = new Rect(position.x - 2, position.y - 2, 30, 30);
    let dragging = false;
    let overlaps = handleBounds.contains(mouseHandler.previousMouse.position.sub(cam.drawOffset));
    if (mouseHandler.currentMouse.pressed && overlaps)
        dragging = true;
    if (id == lastDragHandle && mouseHandler.currentMouse.pressed) {
        dragging = true;
        overlaps = true;
    }
    if (dragging)
        lastDragHandle = id;
    if (overlaps)
        renderTarget.drawRectangle(handleBounds, "yellow");
    renderTarget.drawWireRectangle(handleBounds, "orange");
    return dragging;
}
var handlePos = new Point(8, 8);
function gameLoop(frameCallback) {
    GameTime.update();
    if (dataLoaded) {
        animationPlayer.advance(GameTime.getDeltaTime());
        renderTarget.clearScreen();
        //let frame = animation.frames[animationPlayer.getCurrentFrame()];
        let frame = animation.frames[Number(frameSlider.value)];
        let sprite = animation.gfxAsset?.getSprite(frame.x, frame.y);
        let camX = 0;
        let camY = 0;
        if (sprite != null) {
            camX = (256 - ((animation.gfxAsset?.tileWidth ?? 64) * 4)) / 2;
            camY = (256 - ((animation.gfxAsset?.tileHeight ?? 64) * 4)) / 2;
            renderTarget.drawSprite(sprite, new Point(0, 0), new Point(4, 4), false);
            renderTarget.drawWireRectangle(new Rect(0, 0, (animation.gfxAsset?.tileWidth ?? 64) * 4, (animation.gfxAsset?.tileHeight ?? 64) * 4), "red");
        }
        for (let rect of frame.hitBoxes)
            renderTarget.drawWireRectangle(new Rect(rect.x * 4, rect.y * 4, rect.width * 4, rect.height * 4), "green");
        if (dragHandle(1, handlePos, renderTarget, cam)) {
            handlePos = handlePos.add(mouseHandler.mouseDelta);
        }
        else
            lastDragHandle = 0;
        cam.drawOffset = new Point(camX, camY);
        renderTarget.flush(cam);
        if (mainContext != null) {
            mainContext.clearRect(0, 0, 256, 256);
            mainContext.drawImage(renderTarget.canvas, 0, 0, 256, 256);
        }
        mouseHandler.update();
    }
    frameCallback();
    requestAnimationFrame(() => gameLoop(frameCallback));
}
//# sourceMappingURL=LoadTest.js.map