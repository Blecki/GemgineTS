import { EntityBlueprint } from "./EntityBlueprint.js";
import { Modules } from "./Modules.js";
import { Entity } from "./Entity.js";
import { AssetReference } from "./AssetReference.js";
import { allocateEntityID } from "./AllocateEntityID.js";
import { type ComponentBlueprint, ComponentFactory } from "./ComponentFactory.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { TiledObject } from "./TiledObject.js";
import { Point } from "./Point.js";
import { GameTime } from "./GameTime.js";
import { TiledLayer, TiledTilemap } from "./TiledTilemap.js";
import { RenderLayers, RenderLayersMapping } from "./RenderLayers.js";
import { AssetStore } from "./AssetStore.js";

export class Engine {
  public modules: Modules;
  public assets: AssetStore;
  public sceneRoot: Entity;
  public debugMode: boolean = false;
  public fpsQueue: number[];


  constructor(assets: AssetStore) {
    this.assets = assets;
    this.modules = new Modules();
    this.sceneRoot = new Entity(0, {});
    this.sceneRoot.name = "Scene Root";
    this.fpsQueue = [];
  }

  public start() {
    this.modules.start(this);
  }

  public update() {
    let start = performance.now();
    this.modules.update();
    let end = performance.now();
    this.fpsQueue.push(end - start);
    if (this.fpsQueue.length > 200) this.fpsQueue.shift();
  }

  public run(frameCallback: () => void) {
    GameTime.update();
    this.update();
    frameCallback();
    requestAnimationFrame(() => this.run(frameCallback));
  }

  public createEntityFromBlueprint(parent: Entity, blueprintAsset: AssetReference, template: TiledTemplate): Entity {
    let resultID = allocateEntityID();
    let entity = new Entity(resultID, blueprintAsset.asset);
    parent.addChild(entity);

    let blueprint = blueprintAsset.asset as EntityBlueprint;

    entity.components = blueprint.components.map(c => ComponentFactory.createFromBlueprint(c));
    entity.components.forEach(c => c.parent = entity);
    entity.components.forEach(c => c.initialize(this.assets, template, blueprintAsset));
    this.modules.registerEntity(entity);
    entity.components.forEach(c => c.awake(this.assets, this.modules));

    return entity;
  }

  public createEntitytFromTiledTemplate(parent: Entity, template: TiledTemplate): Entity | null {

    if (template.object?.properties == undefined) {
      console.error("Can't create entity from template without a blueprint.");
      return null;
    }

    let blueprintProperty = template.object.properties.find(p => p.name == 'blueprint');
    if (blueprintProperty?.value == undefined) {
      console.error("Can't create entity from template without a blueprint.");
      return null;
    }

    let blueprint = this.assets.getPreloadedAsset(blueprintProperty.value);
    if (blueprint == undefined) {
      console.error(`Could not find prototype ${blueprintProperty.value}.`);
      return null;
    }

    let r = this.createEntityFromBlueprint(parent, blueprint, template); 
    if (template.object.name != undefined && template.object.name !== null && template.object.name != "")
      r.name = template.object.name;
    return r;  
  }

  public createEntityFromTiledObject(parent: Entity, object: TiledObject): Entity | null {
    if (object.templateAsset == undefined) return null;
    let r = this.createEntitytFromTiledTemplate(parent, object.templateAsset.asset);
    if (r != null) {
      r.localPosition = new Point(object);
      r.localPosition = new Point(r.localPosition.x + r.pivot.x, r.localPosition.y - r.size.y + r.pivot.y);
      if (object.name !== undefined && object.name != "")
        r.name = object.name;
    }
    return r;
  }

  public createEntitiesFromTiledLayer(layer:TiledLayer): Entity[] {
    let r:Entity[] = [];
    if (layer.objects)
      for (let definition of layer.objects)
        if (definition.template != null && definition.template != "") {
          let newEntity = this.createEntityFromTiledObject(this.sceneRoot, definition);
          if (newEntity)
            r.push(newEntity);
        }
    return r;
  }
  
  public createTilemapFromTiledTilemap(path: string, pixelOffset: Point) {
    let tilemap = this.assets.getPreloadedAsset(path).asset as TiledTilemap;
    let r:Entity[] = [];
    if (tilemap.layers)
      for (let layer of tilemap.layers) {
        if (layer.type == "objectgroup") {
          r.push(...this.createEntitiesFromTiledLayer(layer));
        }
        else if (layer.type == "tilelayer") {
          let blueprint = new EntityBlueprint();
          let assetReference = new AssetReference("", blueprint);
          blueprint.components.push({ type: "Tilemap", tilemap: tilemap, layer: layer } as ComponentBlueprint);
          var renderLayer = RenderLayersMapping[layer.properties.filter(p => p.name == "Layer")[0].value];    
          if (renderLayer == RenderLayers.Collision)
            blueprint.components.push({ type: "TilemapCollider" });
          let newEntity = this.createEntityFromBlueprint(this.sceneRoot, assetReference, new TiledTemplate());
          newEntity.localPosition = new Point(layer.x, layer.y);
          newEntity.size = new Point(tilemap.width * tilemap.tilewidth, tilemap.height * tilemap.tileheight);
          newEntity.name = path;
          r.push(newEntity);
        }
      }
    r.forEach(e => {
      e.localPosition.x += pixelOffset.x;
      e.localPosition.y += pixelOffset.y;
    });
    return r;
  }
}