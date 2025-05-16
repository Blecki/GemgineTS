import { AssetLoader } from "./AssetLoader.js";
import { RenderModule } from "./RenderModule.js";
import { RenderingContext } from "./RenderingContext.js";
import { Engine } from "./Engine.js";
import { EntityPrototype } from "./EntityPrototype.js";
import { loadJSON } from "./JsonLoader.js";
import { loadAndConvertJSON } from "./JsonConverter.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { TiledTileset } from "./TiledTileset.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { TiledWorld } from "./TiledWorld.js";
import { Input } from "./Input.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { Animation } from "./Animation.js";
import { SpriteAnimator } from "./SpriteAnimator.js";
import { AnimationModule } from "./AnimationModule.js";
import { Camera } from "./Camera.js";
export function Run() {
    loadJSON("data/", "manifest.json")
        .then(asset => {
        let manifest = asset.asset;
        const canvas = document.getElementById('myCanvas');
        canvas.style.imageRendering = 'pixelated';
        const ctx = canvas.getContext('2d');
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
            engine.componentFactory.addComponentType("Sprite", () => new SpriteComponent());
            engine.componentFactory.addComponentType("Tilemap", () => new TilemapComponent());
            engine.componentFactory.addComponentType("SpriteAnimator", () => new SpriteAnimator());
            var renderModule = new RenderModule();
            engine.addModule(renderModule);
            engine.addModule(new AnimationModule());
            var entityPrototype = new EntityPrototype();
            entityPrototype.components.push({ type: "Tilemap", tilemapName: "assets/test-room.tmj" });
            engine.createEntityFromPrototype(entityPrototype, new TiledTemplate());
            var tilemap = engine.assetMap.get("assets/test-room.tmj").asset;
            for (var layer of tilemap.layers)
                if (layer.type == "objectgroup")
                    for (var definition of layer.objects)
                        if (definition.template != null && definition.template != "")
                            engine.createEntityFromTiledObject(definition);
            var input = new Input();
            input.bind("KeyA", "west");
            input.bind("KeyW", "north");
            input.bind("KeyS", "south");
            input.bind("KeyD", "east");
            input.initialize();
            var camera = new Camera();
            renderModule.setCamera(camera);
            engine.run(new RenderingContext(canvas, ctx), () => {
                if (input.check("west")) {
                    console.log("West Pressed!");
                    camera.position.x -= 1;
                }
                if (input.check("north"))
                    camera.position.y -= 1;
                if (input.check("south"))
                    camera.position.y += 1;
                if (input.check("east"))
                    camera.position.x += 1;
                input.cleanup();
            });
        });
    })
        .catch(error => console.error("Failed to load asset manifest."));
}
//# sourceMappingURL=main.js.map