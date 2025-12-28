import { AssetLoader } from "./AssetLoader.js";
import { RenderModule } from "./RenderModule.js";
import { Engine } from "./Engine.js";
import { EntityBlueprint } from "./EntityBlueprint.js";
import { Entity } from "./Entity.js";
import { loadJSON } from "./JsonLoader.js";
import { loadAndConvertJSON } from "./JsonConverter.js";
import { TiledTileset } from "./TiledTileset.js";
import { TiledTilemap } from "./TiledTilemap.js";
import { TiledWorld } from "./TiledWorld.js";
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

const cellSize = new Point(8, 7);

export type EngineCallback = (engine: Engine) => void;

export function Run(engineCallback: EngineCallback) : void {
  console.log("Starting Engine");
  loadJSON("data/", "manifest.json")
    .then(asset => {
      let manifest = asset.asset as string[];
      const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
      if (canvas == null) throw new Error("Could not find canvas");
      canvas.style.imageRendering = 'pixelated';

      const loader = new AssetLoader();
      loader.addLoader("tmj", loadAndConvertJSON((prototype:object) => new TiledTilemap(prototype)));
      loader.addLoader("tsj", loadAndConvertJSON((prototype:object) => new TiledTileset(prototype)));
      loader.addLoader("world", loadAndConvertJSON((prototype:object) => new TiledWorld(prototype)));
      loader.addLoader("tj", loadAndConvertJSON((prototype:object) => new TiledTemplate(prototype)));
      loader.addLoader("blueprint", loadAndConvertJSON((prototype:object) => new EntityBlueprint(prototype)));
      loader.addLoader("anim", loadAndConvertJSON((prototype:object) => new AnimationAsset(prototype)));
      loader.addLoader("gfx", loadAndConvertJSON((prototype:object) => new GfxAsset(prototype)));
      loader.addLoader("animset", loadAndConvertJSON((prototype:object) => new AnimationSetAsset(prototype)));

      loader.loadAssets("data/", manifest, (assets) => { 
        const engine = new Engine(assets);
        const random = new Random(6);

        engine.debugMode = true;

        engine.addModule(new UpdateModule());
        engine.addModule(new CollisionModule());
        let renderModule = new RenderModule(canvas);
        engine.addModule(renderModule);

        let camera = new Camera();
        renderModule.setCamera(camera);
        camera.position = new Point(0, 0);
        let player: Entity | undefined = undefined;

        console.log("Spawning world");
        let roomEntities = engine.createTilemapFromTiledTilemap("assets/room0.tmj");
        console.log(roomEntities);
        let spawn = roomEntities.find(e => e.getComponent(TagComponent) != undefined);
        if (spawn != undefined) {
          let tag = spawn.getComponent(TagComponent)?.tag ?? "";
          if (tag == "spawn") {
            console.log("Spawning player");
            let playerBlueprint = engine.getAsset("assets/blueprints/player.blueprint");
            player = engine.createEntityFromBlueprint(engine.sceneRoot, playerBlueprint, new TiledTemplate());
            player.localPosition = new Point(spawn.localPosition);
            console.log(player);
          }
        }

        engineCallback(engine);

        engine.run(() => {
          if (player != undefined) camera.position = new Point(player.globalPosition);
          renderModule.render(engine);
        });
      });
    })
    .catch(error => console.error("Failed to load asset manifest."));
44}
