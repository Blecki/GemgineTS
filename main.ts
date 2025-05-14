import { AssetLoader } from "./AssetManagement/AssetLoader.js";
import { AssetReference } from "./AssetManagement/AssetReference.js";
import { Sprite } from "./Sprite.js";
import { Rect } from "./Rect.js";
import { RenderModule } from "./RenderModule.js";
import { RenderingContext } from "./RenderingContext.js";
import { Engine } from "./Engine.js";
import { EntityPrototype } from "./EntityPrototype.js";
import { SpriteComponent } from "./SpriteComponent.js";
import { LoadJSON } from "./AssetManagement/JsonLoader.js";
import { LoadAndConvertJSON } from "./AssetManagement/JsonConverter.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { TiledTileset } from "./TiledTileset.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { TiledWorld } from "./TiledWorld.js";

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

      loader.LoadAssets("data/", manifest, (assets) => { 
        const engine = new Engine(assets);
        engine.AddModule(new RenderModule());
        var entityPrototype = new EntityPrototype();
        entityPrototype.components.push(new TilemapComponent(assets.get("assets/test-room.tmj")));
        engine.CreateEntity(entityPrototype);
        engine.Run(new RenderingContext(canvas, ctx));
      });
    })
    .catch(error => console.error("Failed to load asset manifest."));
}
