import { AssetLoader } from "./AssetLoader.js";
import { RenderModule } from "./RenderModule.js";
import { RenderingContext } from "./RenderingContext.js";
import { Engine } from "./Engine.js";
import { EntityPrototype } from "./EntityPrototype.js";
import { loadJSON } from "./JsonLoader.js";
import { loadAndConvertJSON } from "./JsonConverter.js";
import { TilemapComponent } from "./Tiled/TilemapComponent.js";
import { TiledTileset } from "./Tiled/TiledTileset.js";
import { TiledTilemap } from "./Tiled/TiledTilemap.js";
import { TiledWorld } from "./Tiled/TiledWorld.js";
import { TiledTemplate } from "./Tiled/TiledTemplate.js";
import { Animation } from "./Animation.js";
import { AnimationModule } from "./AnimationModule.js";
import { Camera } from "./Camera.js";
import { UpdateModule } from "./UpdateModule.js";
import { RenderLayersMapping } from "./RenderLayers.js";
import "./SpriteComponent.js";
import "./PlayerControllerComponent.js";
import { Point } from "./Point.js";
export function Run() {
    console.log("Starting Engine");
    loadJSON("data/", "manifest.json")
        .then(asset => {
        let manifest = asset.asset;
        const canvas = document.getElementById('myCanvas');
        canvas.style.imageRendering = 'pixelated';
        const ctx = canvas.getContext('2d');
        if (ctx == null) {
            console.error("Failed to get context");
            return;
        }
        ctx.imageSmoothingEnabled = false;
        const loader = new AssetLoader();
        loader.addLoader("tmj", loadAndConvertJSON(() => new TiledTilemap()));
        loader.addLoader("tsj", loadAndConvertJSON(() => new TiledTileset()));
        loader.addLoader("world", loadAndConvertJSON(() => new TiledWorld()));
        loader.addLoader("tj", loadAndConvertJSON(() => new TiledTemplate()));
        loader.addLoader("proto", loadAndConvertJSON(() => new EntityPrototype()));
        loader.addLoader("anim", loadAndConvertJSON(() => new Animation()));
        loader.loadAssets("data/", manifest, (assets) => {
            const engine = new Engine(assets);
            engine.debugMode = true;
            engine.addModule(new UpdateModule());
            engine.addModule(new AnimationModule());
            let renderModule = new RenderModule();
            engine.addModule(renderModule);
            let spawnedEntities = spawnTilemap(engine, "assets/test-room/tmj");
            let player = null;
            for (let se of spawnedEntities)
                if (se.name == 'spawn') {
                    player = engine.createEntitytFromTiledTemplate(engine.sceneRoot, engine.getAsset("assets/templates/player.tj").asset);
                    if (player)
                        player.localPosition = se.localPosition.copy();
                }
            let camera = new Camera();
            renderModule.setCamera(camera);
            console.log(engine.sceneRoot);
            engine.run(new RenderingContext(canvas, ctx), () => {
                camera.position = player?.globalPosition?.copy() ?? new Point(0, 0);
            });
        });
    })
        .catch(error => console.error("Failed to load asset manifest."));
}
function spawnEntities(engine, layer) {
    let r = [];
    if (layer.objects)
        for (let definition of layer.objects)
            if (definition.template != null && definition.template != "") {
                let newEntity = engine.createEntityFromTiledObject(engine.sceneRoot, definition);
                if (newEntity)
                    r.push(newEntity);
            }
    return r;
}
function spawnTilemap(engine, path) {
    let tilemap = engine.getAsset("assets/test-room.tmj").asset;
    let r = [];
    if (tilemap.layers)
        for (let layer of tilemap.layers) {
            if (layer.type == "objectgroup") {
                r.push(...spawnEntities(engine, layer));
            }
            else if (layer.type == "tilelayer") {
                let prototype = new EntityPrototype();
                prototype.components.push({ type: "Tilemap", tilemap: tilemap, layer: layer });
                let newEntity = engine.createEntityFromPrototype(engine.sceneRoot, prototype, new TiledTemplate());
                let tilemapComponent = newEntity.getComponent(TilemapComponent);
                if (tilemapComponent != null && layer.class != undefined)
                    tilemapComponent.renderLayer = RenderLayersMapping[layer.class];
                r.push(newEntity);
            }
        }
    return r;
}
//# sourceMappingURL=main.js.map