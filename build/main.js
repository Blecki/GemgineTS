import { AssetLoader } from "./AssetLoader.js";
import { RenderModule } from "./RenderModule.js";
import { Engine } from "./Engine.js";
import { EntityBlueprint } from "./EntityBlueprint.js";
import { Entity } from "./Entity.js";
import { loadJSON } from "./JsonLoader.js";
import { loadAndConvertJSON } from "./JsonConverter.js";
import { loadAndConvertText } from "./TextLoader.js";
import { TiledTileset } from "./TiledTileset.js";
import { TiledTilemap } from "./TiledTilemap.js";
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
import { PhysicsModule } from "./PhysicsModule.js";
import { Shader } from "./Shader.js";
import { TilemapColliderComponent } from "./TilemapColliderComponent.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { Rect } from "./Rect.js";
const cellSize = new Point(8, 7);
function spawnMap(engine, map) {
    return engine.createTilemapFromTiledTilemap("assets/" + map.fileName, new Point(map?.x ?? 0, map?.y ?? 0));
}
function spawnPlayer(engine, spawnPoint) {
    let playerBlueprint = engine.getAsset("assets/blueprints/player.blueprint");
    let player = engine.createEntityFromBlueprint(engine.sceneRoot, playerBlueprint, new TiledTemplate());
    player.localPosition = new Point(spawnPoint.localPosition);
    return player;
}
function findEntityWithTag(entities, tag) {
    for (let e of entities) {
        let component = e.getComponent(TagComponent);
        if (component != undefined && component.tag == tag)
            return e;
    }
    return null;
}
export function Run(engineCallback, canvas) {
    console.log("Starting Engine");
    loadJSON("data/", "manifest.json")
        .then(asset => {
        let manifest = asset.asset;
        canvas.style.imageRendering = 'pixelated';
        let screenSize = new Point(canvas.width, canvas.height);
        const loader = new AssetLoader();
        loader.addLoader("tmj", loadAndConvertJSON((prototype) => new TiledTilemap(prototype)));
        loader.addLoader("tsj", loadAndConvertJSON((prototype) => new TiledTileset(prototype)));
        loader.addLoader("world", loadAndConvertJSON((prototype) => new TiledWorld(prototype)));
        loader.addLoader("tj", loadAndConvertJSON((prototype) => new TiledTemplate(prototype)));
        loader.addLoader("blueprint", loadAndConvertJSON((prototype) => new EntityBlueprint(prototype)));
        loader.addLoader("anim", loadAndConvertJSON((prototype) => new AnimationAsset(prototype)));
        loader.addLoader("gfx", loadAndConvertJSON((prototype) => new GfxAsset(prototype)));
        loader.addLoader("animset", loadAndConvertJSON((prototype) => new AnimationSetAsset(prototype)));
        loader.addLoader('glsl', loadAndConvertText((text) => new Shader(text)));
        loader.loadAssets("data/", manifest, (assets) => {
            const engine = new Engine(assets);
            engine.debugMode = true;
            engine.addModule(new UpdateModule());
            engine.addModule(new CollisionModule());
            engine.addModule(new PhysicsModule());
            let renderModule = new RenderModule(canvas);
            engine.addModule(renderModule);
            engine.start();
            let camera = new Camera();
            renderModule.setCamera(camera);
            camera.position = new Point(0, 0);
            let world = engine.getAsset("assets/base-world.world").asset;
            let startMap = world.findMapWithName("room0.tmj");
            if (startMap == null)
                throw "Could not find start map";
            let roomEntities = spawnMap(engine, startMap);
            let spawn = findEntityWithTag(roomEntities, "spawn");
            if (spawn == null)
                throw "Could not find spawn point";
            let player = spawnPlayer(engine, spawn);
            let cameraBounds = new Rect(0, 0, 1, 1);
            let collisionSpaces = roomEntities.filter(r => r.getComponent(TilemapComponent) != null);
            if (collisionSpaces.length > 0)
                cameraBounds = collisionSpaces[0].globalBounds;
            engineCallback(engine);
            engine.run(() => {
                if (player != undefined)
                    camera.position = new Point(player.globalPosition);
                camera.confineToVisibleBounds(cameraBounds, screenSize);
                renderModule.render(engine);
            });
        });
    })
        .catch(error => console.error("Failed to load asset manifest."));
}
//# sourceMappingURL=Main.js.map