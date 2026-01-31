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
import { GameTime  } from "./GameTime.js";
import { Fluent, type FluentElement } from "./Fluent.js";
import { RenderTarget } from "./RenderTarget.js";
import { AnimationPlayer } from "./AnimationPlayer.js";
import { AssetStore } from "./AssetStore.js";
import { AnimationHitBox } from "./AnimationHitBox.js";
import { EditorContext } from "./EditorContext.js";
import { MouseHandler } from "./MouseHandler.js";

var outerFrame: HTMLElement; 
var previewCanvas: HTMLCanvasElement;
var renderTarget: RenderTarget;
var animationPlayer: AnimationPlayer;
var animation: AnimationAsset;
var cam: Camera;
var dataLoaded: boolean = false;
var frameSlider: HTMLInputElement;
var animSelector: HTMLSelectElement;
var editorContext: EditorContext;

export function Run(frame: HTMLElement) : void {
  outerFrame = frame;

  const loader = new AssetLoader();
  loader.setupStandardLoaders();
  const store = new AssetStore("data/", null, loader);
  let test = store.loadAsset("assets/player/player.animset");
  test.then(asset => render(asset.asset as AnimationSetAsset));
 
  cam = new Camera(new Point(256, 256));
  cam.scale = new Point(4,4);
  gameLoop(() => {
    
    
  
  }); 
}

function render(animSet: AnimationSetAsset) {
  let f = new Fluent();
  animation = animSet.animations[0];
  let widget = f.div()._append(
    f.div()._append(
      animSelector = f.e('select')._append(
        ...animSet.animations.map((a, i) => f.e('option')._append(a.name)._modify(oz => oz.value = i))
      )
      ._handler('change', () => {
        animation = animSet.animations[Number(animSelector.value)];
        frameSlider.max = `${animation.frames.length - 1}`;
      }) as unknown as HTMLSelectElement,
      frameSlider = f.input('range')._modify(f => { 
        let e = f as unknown as HTMLInputElement;
        e.step = "1";
        e.min = "0";
        e.max = `${animation.frames.length - 1}`;
      }) as unknown as HTMLInputElement,
      f.button()._append("+")
        ._handler('click', () => { 
          let frame = animation.frames[Number(frameSlider.value)];
          frame.hitBoxes.push(new AnimationHitBox({ x: 4, y: 4, width: 16, height: 16 }));
        }),
      f.button()._append("X")
    ),
    previewCanvas = (f.e('canvas')
      ._modify(c => { let e = c as unknown as HTMLCanvasElement; e.width = 256; e.height = 256; }) as unknown as HTMLCanvasElement)
  );
  outerFrame.appendChild(widget);
  
  renderTarget = new RenderTarget(previewCanvas);
  animationPlayer = new AnimationPlayer(animation.frames.length, animation.fps, true, 0);
  editorContext = new EditorContext(cam, renderTarget);

  dataLoaded = true;
}

var selectedRectangle = -1;

function gameLoop(frameCallback: () => void) {
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
        console.log( `Selecting rect ${lcopy_x}`);
        selectedRectangle = lcopy_x; 
      });
    }
    editorContext.close();


    renderTarget.flush(cam);
  }

  frameCallback();
  requestAnimationFrame(() => gameLoop(frameCallback));
}
