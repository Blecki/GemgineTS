import { AssetLoader } from "./AssetLoader.js";
import { RenderModule } from "./RenderModule.js";
import { RenderingContext } from "./RenderingContext.js";
import { Engine } from "./Engine.js";
import { EntityPrototype } from "./EntityPrototype.js";
import { LoadJSON } from "./JsonLoader.js";
import { LoadAndConvertJSON } from "./JsonConverter.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { TiledTileset } from "./TiledTileset.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { TiledWorld } from "./TiledWorld.js";
import { Input } from "./Input.js";
export function Run() {
    LoadJSON("data/", "manifest.json")
        .then(asset => {
        let manifest = asset.asset;
        const canvas = document.getElementById('myCanvas');
        const ctx = canvas.getContext('2d');
        const loader = new AssetLoader();
        loader.AddLoader("world", LoadJSON);
        loader.AddLoader("tmj", LoadAndConvertJSON(() => new TiledTilemap()));
        loader.AddLoader("tsj", LoadAndConvertJSON(() => new TiledTileset()));
        loader.AddLoader("world", LoadAndConvertJSON(() => new TiledWorld()));
        loader.LoadAssets("data/", manifest, (assets) => {
            const engine = new Engine(assets);
            engine.AddModule(new RenderModule());
            var entityPrototype = new EntityPrototype();
            entityPrototype.components.push(new TilemapComponent(assets.get("assets/test-room.tmj")));
            engine.CreateEntity(entityPrototype);
            var input = new Input();
            input.Bind("Space", "button");
            input.Initialize();
            engine.Run(new RenderingContext(canvas, ctx), () => {
                var spacePress = input.tryGetRecentInput("button", 1000);
                if (spacePress != null) {
                    input.markHandled(spacePress);
                    console.log("Space pressed!");
                }
                input.cleanup();
            });
        });
    })
        .catch(error => console.error("Failed to load asset manifest."));
}
//# sourceMappingURL=Main.js.map