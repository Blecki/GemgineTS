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
import { EditorContext } from "./editor/EditorContext.js";
import { MouseHandler } from "./MouseHandler.js";
import { PropertyGrid } from "./editor/PropertyGrid.js";
var outerFrame;
var previewCanvas;
var renderTarget;
var animationPlayer;
var animation;
var cam;
var dataLoaded = false;
var frameSlider;
var animSelector;
var editorContext;
var pGrid;
export function Run(frame) {
    outerFrame = frame;
    const loader = new AssetLoader();
    loader.setupStandardLoaders();
    const store = new AssetStore("data/", null, loader);
    let test = store.loadAsset("assets/green-slime.animset");
    test.then(asset => render(asset.asset));
    cam = new Camera(new Point(256, 256));
    cam.scale = new Point(4, 4);
    gameLoop(() => {
    });
}
function render(animSet) {
    let f = new Fluent();
    animation = animSet.animations[0];
    let saveOutput = f.e('textarea');
    let widget = f.div()._style({ display: "grid", gridTemplateColumns: "50% 50%", gridTemplateRows: "40px 256px auto" })._append(f.div()._append(animSelector = f.e('select')._append(...animSet.animations.map((a, i) => f.e('option')._append(a.name)._modify(oz => oz.value = i)))
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
    }), f.button()._append("X"), f.button()._append('>')._handler('click', () => {
        saveOutput.value = JSON.stringify(animSet, null, 2);
    })), f.div(), previewCanvas = f.e('canvas')
        ._modify(c => { let e = c; e.width = 256; e.height = 256; }), pGrid = f.div(), saveOutput);
    outerFrame.appendChild(widget);
    renderTarget = new RenderTarget(previewCanvas);
    animationPlayer = new AnimationPlayer(animation.frames.length, animation.fps, true, 0);
    editorContext = new EditorContext(cam, renderTarget);
    dataLoaded = true;
}
var selectedRectangle = -1;
function gameLoop(frameCallback) {
    GameTime.update();
    if (dataLoaded) {
        renderTarget.clearScreen();
        let frame = animation.frames[Number(frameSlider.value)];
        let sprite = animation.gfxAsset?.getSprite(frame.x, frame.y);
        if (sprite != null) {
            cam.moveCameraTeleport(new Point((animation.gfxAsset?.tileWidth ?? 64) / 2, (animation.gfxAsset?.tileHeight ?? 64) / 2));
            renderTarget.drawSprite(sprite, new Point(0, 0), false);
            renderTarget.drawWireRectangle(new Rect(0, 0, (animation.gfxAsset?.tileWidth ?? 64), (animation.gfxAsset?.tileHeight ?? 64)), "red");
        }
        cam.update();
        editorContext.open();
        for (let x = 0; x < frame.hitBoxes.length; ++x) {
            let lcopy_x = x;
            editorContext.adjustRect(frame.hitBoxes[x], x == selectedRectangle).ifClicked(() => {
                console.log(`Selecting rect ${lcopy_x}`);
                let inspector = new PropertyGrid(frame.hitBoxes[lcopy_x]);
                pGrid.innerHTML = "";
                pGrid._append(inspector.element);
                selectedRectangle = lcopy_x;
            });
        }
        editorContext.close();
        renderTarget.flush(cam);
    }
    frameCallback();
    requestAnimationFrame(() => gameLoop(frameCallback));
}
//# sourceMappingURL=LoadTest.js.map