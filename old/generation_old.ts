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
import { Array2D } from "./Array2D.js";
import { Random } from "./Random.js";
import { Room } from "./Room.js";
import { Door } from "./Door.js";
import { RoomGrid, GridCell } from "./RoomGrid.js";
import { Dungeon, DungeonPath } from "./Dungeon.js";

const cellSize = new Point(8, 7);

class PathSet {
  public color: string = "red";
  public paths: DungeonPath[] = [];

  constructor(color: string, paths: DungeonPath[]) {
    this.color = color;
    this.paths = paths;
  }
}

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
        const random = new Random(6);

        engine.debugMode = true;

        engine.addModule(new UpdateModule());
        let renderModule = new RenderModule();
        engine.addModule(renderModule);

        let dungeon = new Dungeon(256/cellSize.x, 224/cellSize.y, random);
        //let dungeon = new Dungeon(10,10);
        dungeon.rooms.forEach(r => r.image = r.render(cellSize));
        dungeon.rooms.forEach(r => r.setupDoorPathing());
        //dungeon.rooms.forEach((r, i) => { if (i != 0) r.optimizeDoors(); });

        let pathSets: PathSet[] = [];
        //let paths = condensePaths(dungeon.findPaths(dungeon.startRoom, (r) => r.label == 'K' || r.label == 'Z', [], 0, false));
        let path = dungeon.findPaths(dungeon.startRoom, (r) => r.label == 'K' || r.label == 'Z', [], 0, false);
        /*
        while(paths.some(p => p.terminationType == 0)) {
          console.log(paths);
          paths = paths.flatMap(p => {
            if (p.terminationType != 0) return p;
            p.powerupsCollected.push(p.getCurrentNode().room);
            let nextPaths = condensePaths(dungeon.findPaths(p.getCurrentNode().room, (r) => (r.label == 'K' || r.label == 'Z' || r.label == 'B') && !p.powerupsCollected.includes(r), p.doorsUnlocked, p.keyCount + 1, (p.bossKey || p.getCurrentNode().room.label == 'Z')));
            if (nextPaths.length == 0) {
              p.terminationType = 1;
              p.color = {r: 255, g: 0, b: 0, a: 255};
              return p;
            }
            else
              nextPaths.forEach(np => {
                if (np.getCurrentNode().room.label == 'B') {
                  np.terminationType = 2;
                  np.color = {r: 0, g: 255, b: 0, a: 255};
                }
              });
            return nextPaths.map(np => concatPaths(p, np));
          });
        }
        */
        let steps = 0;
        while(path.terminationType == 0 && steps < 9) {
          steps += 1;
            path.powerupsCollected.push(path.getCurrentNode().room);
            let nextPath = dungeon.findPaths(path.getCurrentNode().room, (r) => (r.label == 'K' || r.label == 'Z' || r.label == 'B') && !path.powerupsCollected.includes(r), path.doorsUnlocked, path.keyCount + 1, (path.bossKey || path.getCurrentNode().room.label == 'Z'));
            
                if (nextPath.getCurrentNode().room.label == 'B') {
                  nextPath.terminationType = 2;
                  nextPath.color = {r: 0, g: 255, b: 0, a: 255};
                }
              path = concatPaths(path, nextPath);
              console.log(path);
          }

        let timeSincePathChange = 0.0;
        let currentDisplayedPath = 0;

        let camera = new Camera();
        renderModule.setCamera(camera);
        camera.position = new Point(128, 112);

        let renderContext = new RenderingContext(canvas, ctx);
        engine.run(renderContext, () => {
          for (let room of dungeon.rooms) {
            if (room.image != null) 
              renderContext.drawImage(room.image, new Rect(0, 0, room.rect.width * cellSize.x, room.rect.height * cellSize.y), new Point(room.rect.x * cellSize.x, room.rect.y * cellSize.y));
            renderContext.drawString(room.label, new Point(room.rect.x * cellSize.x, room.rect.y * cellSize.y), "white");
          }
          let shift = 0;
          /*timeSincePathChange += GameTime.getDeltaTime();
          if (timeSincePathChange > 3) {
            currentDisplayedPath += 1;
            timeSincePathChange = 0;
            if (currentDisplayedPath >= paths.length)
              currentDisplayedPath = 0;
          }*/
          //let path = paths[currentDisplayedPath];
          let pathLength = path.nodes.length;
          let colorStep = 1.0 / pathLength;
          let colorScale = 0.0;
          let powerups: number = 0;
          let visitedPowerups: Room[] = [];
          for (let node of path.nodes) {
            colorScale += colorStep;
            let d1: Point;
            let d2 = new Point((node.room.rect.x + (node.room.rect.width / 2)) * cellSize.x, (node.room.rect.y + (node.room.rect.height / 2)) * cellSize.y);
            let d3: Point;
            if (node.inDoor == -1)
              d1 = new Point((node.room.rect.x + (node.room.rect.width / 2)) * cellSize.x, (node.room.rect.y + (node.room.rect.height / 2)) * cellSize.y);
            else 
              d1 = new Point(node.room.doors[node.inDoor].pixelAnchor.x + (node.room.rect.x * cellSize.x), node.room.doors[node.inDoor].pixelAnchor.y + (node.room.rect.y * cellSize.y));
            if (node.outDoor == -1)
              d3 = new Point((node.room.rect.x + (node.room.rect.width / 2)) * cellSize.x, (node.room.rect.y + (node.room.rect.height / 2)) * cellSize.y);
            else
              d3 = new Point(node.room.doors[node.outDoor].pixelAnchor.x + (node.room.rect.x * cellSize.x), node.room.doors[node.outDoor].pixelAnchor.y + (node.room.rect.y * cellSize.y));
            renderContext.drawLine(d1, d2, `rgb(${path.color.r * colorScale}, ${path.color.g * colorScale}, ${path.color.b * colorScale})`);
            renderContext.drawLine(d2, d3, `rgb(${path.color.r * colorScale}, ${path.color.g * colorScale}, ${path.color.b * colorScale})`);
            if (node.room.label != '' && node.room.label != 'S' && !visitedPowerups.includes(node.room)) {
              renderContext.drawString(`${powerups}`, new Point(node.room.rect.x * cellSize.x + ((node.room.rect.width * cellSize.x) / 2), node.room.rect.y * cellSize.y + ((node.room.rect.height * cellSize.y) / 2)), "red"); 
              powerups += 1;
              visitedPowerups.push(node.room);
            }
          }
        });
      });
    })
    .catch(error => console.error("Failed to load asset manifest."));
}

export class PathBin {
  key: Room;
  values: DungeonPath[] = [];
  constructor (key: Room) {
    this.key = key;
  }
};

function binSortPaths(paths: DungeonPath[]) : PathBin[] {
  let r: PathBin[] = [];
  paths.forEach(p => {
    let end = p.getCurrentNode();
    let bin = r.find(b => b.key === end.room);
    if (bin == undefined) {
      bin = new PathBin(end.room);
      r.push(bin);
    }
    bin.values.push(p);
  });
  return r;
}

function getShortest(paths: DungeonPath[]) : DungeonPath[] {
  const min = Math.min(...paths.map(p => p.cost));
  return paths.filter(p => p.cost == min);
}

function combinePathArrays(arrays: DungeonPath[][]) : DungeonPath[] {
  let r: DungeonPath[] = [];
  return r.concat(...arrays);
}

function condensePaths(paths: DungeonPath[]) : DungeonPath[] {
  const bins = binSortPaths(paths);
  const smallest = bins.map(b => getShortest(b.values));
  return combinePathArrays(smallest);
}

function concatPaths(a: DungeonPath, b: DungeonPath) {
  let r = new DungeonPath();
  a.nodes.forEach(n => r.nodes.push(n));
  a.getCurrentNode().outDoor = b.nodes[0].outDoor;
  b.nodes.slice(1).forEach(n => r.nodes.push(n));
  r.keyCount = b.keyCount;
  r.bossKey = b.bossKey;
  a.powerupsCollected.forEach(n => r.powerupsCollected.push(n));
  r.cost = b.cost;
  //a.doorsUnlocked.forEach(n => r.doorsUnlocked.push(n));
  b.doorsUnlocked.forEach(n => r.doorsUnlocked.push(n));
  r.terminationType = b.terminationType;
  r.color = b.color;
  return r;
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