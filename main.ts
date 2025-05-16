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
import { TiledTemplate } from "./TiledTemplate.js";
import { SpriteComponent } from "./SpriteComponent.js";

export function Run() {
  LoadJSON("data/", "manifest.json")
    .then(asset => {
      let manifest = asset.asset as string[];
      const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
      const ctx = canvas.getContext('2d')

      const loader = new AssetLoader();
      loader.AddLoader("world", LoadJSON);
      loader.AddLoader("tmj", LoadAndConvertJSON(() => new TiledTilemap()));
      loader.AddLoader("tsj", LoadAndConvertJSON(() => new TiledTileset()));
      loader.AddLoader("world", LoadAndConvertJSON(() => new TiledWorld()));
      loader.AddLoader("tj", LoadAndConvertJSON(() => new TiledTemplate()));
      loader.AddLoader("proto", LoadAndConvertJSON(() => new EntityPrototype()));

      loader.LoadAssets("data/", manifest, (assets) => { 
        const engine = new Engine(assets);
        engine.componentFactory.addComponentType("Sprite", () => new SpriteComponent());
        engine.componentFactory.addComponentType("Tilemap", () => new TilemapComponent());
        engine.AddModule(new RenderModule());
        var entityPrototype = new EntityPrototype();
        entityPrototype.components.push({ type: "Tilemap", tilemapName: "assets/test-room.tmj" });
        engine.CreateEntityFromPrototype(entityPrototype, new TiledTemplate());

        var tilemap = engine.AssetMap.get("assets/test-room.tmj").asset as TiledTilemap;
        console.log(tilemap);
        for (var layer of tilemap.layers)
          if (layer.type == "objectgroup")
            for (var definition of layer.objects)
              if (definition.template != null && definition.template != "")
                engine.CreateEntityFromTiledObject(definition);
              

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
