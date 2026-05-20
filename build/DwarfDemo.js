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
import { Component } from "./Component.js";
import { PlayerControllerComponent } from "./PlayerControllerComponent.js";
import { BoundsColliderComponent } from "./BoundsColliderComponent.js";
import { TagComponent } from "./TagComponent.js";
import { HealthComponent } from "./HealthComponent.js";
import { GUIHealthBarComponent } from "./GUIHealthBarComponent.js";
import { PhysicsModule } from "./PhysicsModule.js";
import { TilemapColliderComponent } from "./TilemapColliderComponent.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { Rect } from "./Rect.js";
import { AssetStore } from "./AssetStore.js";
import { HitBoxModule, HitBoxRecord } from "./HitBoxModule.js";
import { RenderLayers } from "./RenderLayers.js";
function spawnPlayer(engine, spawnPoint) {
    let playerBlueprint = engine.assets.getPreloadedAsset("assets/blueprints/player.blueprint");
    let player = engine.createEntityFromBlueprint(engine.sceneRoot, playerBlueprint, new TiledTemplate());
    player.localPosition = new Point(spawnPoint);
    return player;
}
export function Run(engineCallback, canvas) {
    console.log("Starting Engine");
    loadJSON("data/", "manifest.json")
        .then(asset => {
        let manifest = asset.asset;
        canvas.style.imageRendering = 'pixelated';
        let screenSize = new Point(canvas.width, canvas.height);
        console.log("Screensize:");
        console.log(screenSize);
        const loader = new AssetLoader();
        loader.setupStandardLoaders();
        loader.loadAssets("data/", manifest, (assets) => {
            console.log("Done loading. Starting engine...");
            const engine = new Engine(new AssetStore("data/", assets, loader));
            engine.debugMode = true;
            engine.modules.addModule(new UpdateModule());
            let renderModule = new RenderModule(canvas);
            engine.modules.addModule(renderModule);
            engine.start();
            let camera = new Camera(screenSize);
            renderModule.setCamera(camera);
            camera.position = new Point(0, 0);
            let player = spawnPlayer(engine, new Point(0, 0));
            console.log(player);
            engineCallback(engine);
            console.log("Here we go!");
            engine.run(() => {
                //if (player != undefined) //camera.position = new Point(player.globalPosition);
                camera.update();
                //camera.confineToVisibleBounds(new Rect(currentMap?.x ?? 0, currentMap?.y ?? 0, currentMap?.width ?? 1, currentMap?.height ?? 1), screenSize);
                renderModule.render_ex(engine);
            });
        });
    })
        .catch(error => console.error("Failed to load asset manifest."));
}
//# sourceMappingURL=DwarfDemo.js.map