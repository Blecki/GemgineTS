import { AssetReference, LoadAssets } from "./AssetLoader.js";
import { Sprite } from "./Sprite.js";
import { Rect } from "./Rect.js";
import { RenderModule } from "./RenderModule.js";
import { RenderingContext } from "./RenderingContext.js";
import { Engine } from "./Engine.js";
import { EntityPrototype } from "./EntityPrototype.js";
import { SpriteComponent } from "./SpriteComponent.js";

export function Run() {
  const imageUrls: AssetReference[] = [
    new AssetReference("tiles.png")
  ];

  const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
  const ctx = canvas.getContext('2d')

  LoadAssets(imageUrls, (assets) => { 
    const engine = new Engine();
    engine.AddModule(new RenderModule());
    var entityPrototype = new EntityPrototype();
    entityPrototype.components.push(new SpriteComponent(new Sprite(assets[0], new Rect(0,0,16,16))));
    engine.CreateEntity(entityPrototype);
    engine.Run(new RenderingContext(canvas, ctx));
  });
}
