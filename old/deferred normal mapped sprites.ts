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
import { Camera } from "./Camera.js";
import { UpdateModule } from "./UpdateModule.js";
import { RenderLayersMapping } from "./RenderLayers.js";
import { Entity } from "./Entity.js"
import { TiledLayer } from "./Tiled/TiledTilemap.js";
import "./SpriteComponent.js";
import "./PlayerControllerComponent.js";
import { Point } from "./Point.js";
import { GfxAsset } from "./GfxAsset.js";
import { AssetReference } from "./AssetReference.js";
import { AnimationSetAsset } from "./AnimationSetAsset.js";
import { RawImage } from "./RawImage.js";
import { Rect } from "./Rect.js";
import { Color } from "./Color.js";
import { Input } from "./Input.js";
import { GameTime } from "./GameTime.js";

export function Run() {
  console.log("Starting Engine");
  loadJSON("data/", "manifest.json")
    .then(asset => {
      let manifest = asset.asset as string[];
      const canvas = document.getElementById('myCanvas') as HTMLCanvasElement;
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
      loader.addLoader("gfx", loadAndConvertJSON(() => new GfxAsset()));
      loader.addLoader("animset", loadAndConvertJSON(() => new AnimationSetAsset()));

      loader.loadAssets("data/", manifest, (assets) => { 
        const engine = new Engine(assets);

        engine.debugMode = true;

        engine.addModule(new UpdateModule());
        let renderModule = new RenderModule();
        engine.addModule(renderModule);

        /*
        let spawnedEntities = spawnTilemap(engine, "assets/test-room/tmj");
        let player: Entity | null = null;
        for (let se of spawnedEntities)
          if (se.name == 'spawn') {
            player = engine.createEntityFromPrototype(engine.sceneRoot, engine.getAsset("assets/prototypes/player.proto"), new TiledTemplate());
            if (player)
              player.localPosition = se.localPosition.copy();
          }
        */

        let testImage = engine.getAsset("assets/normals-test-base.bmp").asset as RawImage;
        console.log(testImage);
        let testNormals = engine.getAsset("assets/normals-test-normals.bmp").asset as RawImage;
        let diffuseBuffer = RawImage.createBlank(canvas.width, canvas.height);
        diffuseBuffer.shade((destx, desty, u, v) => { return testImage.sample(u, v, 'nearest'); }, new Rect(64, 64, 64, 64));
        let normalBuffer = RawImage.createBlank(canvas.width, canvas.height);
        normalBuffer.fillWithColor({r: 127, g: 127, b: 255, a: 255});
        normalBuffer.shade((destx, desty, u, v) => { return testNormals.sample(u, v, 'nearest'); }, new Rect(64, 64, 64, 64));
        let frame = RawImage.createBlank(canvas.width, canvas.height);
        
        let camera = new Camera();
        renderModule.setCamera(camera);

        class Light {
          public Position: Vector3;
          public Radius: number;
          public Color: Color;
        
          constructor(Position: Vector3, Radius: number, Color: Color) {
            this.Position = Position;
            this.Radius = Radius;
            this.Color = Color;
          }
        }

        let lights: Light[] = [];
        lights.push(new Light({x: 32, y:32, z:10}, 10000000, {r: 255, g: 0, b: 0, a: 255}));
        lights.push(new Light({x: 64, y:32, z:10}, 128, {r: 0, g: 255, b: 0, a: 255}));
        lights.push(new Light({x: 64, y:64, z:10}, 10000000, {r: 0, g: 0, b: 255, a: 255}));

        let input = new Input();
        input.bind("KeyA", "west");
        input.bind("KeyW", "north");
        input.bind("KeyS", "south");
        input.bind("KeyD", "east");
        input.initialize();

        let renderContext = new RenderingContext(canvas, ctx);
        engine.run(renderContext, () => {
          
          if (input?.check("west")) lights[0].Position.x -= (16 * GameTime.getDeltaTime());
          if (input?.check("north")) lights[0].Position.y -= (16 * GameTime.getDeltaTime());
          if (input?.check("south")) lights[0].Position.y += (16 * GameTime.getDeltaTime());
          if (input?.check("east")) lights[0].Position.x += (16 * GameTime.getDeltaTime());
          input?.cleanup();

          frame.shade((destx, desty, u, v) => { 
            let lighting = {r: 0, g: 0, b: 0};
            const normal = normalBuffer.sample(u, v, 'nearest');
            const surfaceNormal = { x: (2 * normal.r / 255) - 1, y: (2 * normal.g / 255) - 1, z: (2 * normal.b / 255) - 1 };
            const diffuseColor = diffuseBuffer.sample(u, v, 'nearest');

            for (let light of lights) {
              const distanceToLight = Math.sqrt((destx - light.Position.x) ** 2 + (desty - light.Position.y) ** 2);
              const lightDirection = { x: light.Position.x - destx, y: light.Position.y - desty, z: light.Position.z - 0 };
              const cosAngle = dotProduct(normalize(surfaceNormal), normalize(lightDirection));
              const lightIntensity = Math.max(0, 1 - distanceToLight / light.Radius) * Math.max(0, cosAngle);
              const viewDirection = { x: 0, y: 0, z: -1 };

              // Calculate the halfway vector between the light direction and view direction for specular reflection
              const halfwayVector = normalize({ x: lightDirection.x + viewDirection.x, y: lightDirection.y + viewDirection.y, z: lightDirection.z + viewDirection.z });

              // Calculate the specular intensity based on the surface properties (shininess)
              const shininess = 64; // Adjust based on material properties
              const specularIntensity = Math.pow(Math.max(0, dotProduct(surfaceNormal, halfwayVector)), shininess);

              lighting.r +=  (lightIntensity + specularIntensity) * (light.Color.r / 255);
              lighting.g +=  (lightIntensity + specularIntensity) * (light.Color.g / 255);
              lighting.b +=  (lightIntensity + specularIntensity) * (light.Color.b / 255);
            }

            return {
              r: Math.round(diffuseColor.r * lighting.r),
              g: Math.round(diffuseColor.r * lighting.g),
              b: Math.round(diffuseColor.r * lighting.b),
              a: 255 };
          }, new Rect(0, 0, frame.width, frame.height));


          let final = frame.toImageBitmap();
        
          if (final != null) renderContext.drawImage(final, new Rect(0,0, frame.width, frame.height), new Point(-(canvas.width / 2), -(canvas.height / 2)));
          //renderContext.drawSprite(npc.gfx.getSprite(0, 0), new Point(0,0));
          //renderContext.drawImage(npcImage as ImageBitmap, new Rect(0, 0, npcImage?.width ?? 1, npcImage?.height ?? 1), new Point(0,0));
          //camera.position = player?.globalPosition?.copy() ?? new Point(0,0);
        });
      });
    })
    .catch(error => console.error("Failed to load asset manifest."));
}

interface Vector3 {
  x:number;
  y:number;
  z:number;
}

// Helper functions for vector operations
function dotProduct(v1 : Vector3, v2: Vector3) {
    return v1.x * v2.x + v1.y * v2.y + v1.z * v2.z;
}

function normalize(v: Vector3) {
    const length = Math.sqrt(v.x ** 2 + v.y ** 2 + v.z ** 2);
    return { x: v.x / length, y: v.y / length, z: v.z / length };
}

function spawnEntities(engine:Engine, layer:TiledLayer): Entity[] {
  let r:Entity[] = [];
  if (layer.objects)
    for (let definition of layer.objects)
      if (definition.template != null && definition.template != "") {
        let newEntity = engine.createEntityFromTiledObject(engine.sceneRoot, definition);
        if (newEntity)
          r.push(newEntity);
      }
  return r;
}

function spawnTilemap(engine:Engine, path: string) {
  let tilemap = engine.getAsset("assets/test-room.tmj").asset as TiledTilemap;
  let r:Entity[] = [];
  if (tilemap.layers)
    for (let layer of tilemap.layers) {
      if (layer.type == "objectgroup") {
        r.push(...spawnEntities(engine, layer));
      }
      else if (layer.type == "tilelayer") {
        let prototype = new EntityPrototype();
        let assetReference = new AssetReference("", prototype);
        prototype.components.push({ type: "Tilemap", tilemap: tilemap, layer: layer });
        let newEntity = engine.createEntityFromPrototype(engine.sceneRoot, assetReference, new TiledTemplate());
        let tilemapComponent = newEntity.getComponent(TilemapComponent);
        if (tilemapComponent != null && layer.class != undefined) tilemapComponent.renderLayer = RenderLayersMapping[layer.class];
        r.push(newEntity);
      }
    }
  return r;
}

