import { EntityBlueprint } from "./EntityBlueprint.js";
import { Module } from "./Module.js";
import { Entity } from "./Entity.js";
import { AssetReference } from "./AssetReference.js";
import { allocateEntityID } from "./AllocateEntityID.js";
import { Component } from "./Component.js";
import { ComponentFactory } from "./ComponentFactory.js";
import { TiledTemplate } from "./TiledTemplate.js";
import { TiledObject, TiledProperty } from "./TiledObject.js";
import { Point } from "./Point.js";
import { GameTime } from "./GameTime.js";
import { TiledLayer, TiledTilemap } from "./TiledTilemap.js";
import { TilemapComponent } from "./TilemapComponent.js";
import { TilemapColliderComponent } from "./TilemapColliderComponent.js";
import { RenderLayers, RenderLayersMapping } from "./RenderLayers.js";
export class Engine {
    modules = [];
    assetMap;
    sceneRoot;
    debugMode = false;
    fpsQueue;
    constructor(assetMap) {
        this.assetMap = assetMap;
        for (const [, value] of assetMap) {
            value.resolveDependencies(this);
        }
        this.sceneRoot = new Entity(0, {});
        this.sceneRoot.name = "Scene Root";
        this.fpsQueue = [];
    }
    getAsset(path) {
        console.log("ASSET REQUEST: " + path);
        return this.assetMap?.get(path) ?? new AssetReference(path, null);
    }
    start() {
        for (let module of this.modules)
            module.engineStart(this);
    }
    update() {
        let start = performance.now();
        for (let module of this.modules)
            module.update();
        let end = performance.now();
        this.fpsQueue.push(end - start);
        if (this.fpsQueue.length > 200)
            this.fpsQueue.shift();
    }
    run(frameCallback) {
        GameTime.update();
        this.update();
        frameCallback();
        requestAnimationFrame(() => this.run(frameCallback));
    }
    addModule(newModule) {
        this.modules.push(newModule);
    }
    createEntityFromBlueprint(parent, blueprintAsset, template) {
        let resultID = allocateEntityID();
        let entity = new Entity(resultID, blueprintAsset.asset);
        parent.addChild(entity);
        let blueprint = blueprintAsset.asset;
        entity.components = blueprint.components.map(c => ComponentFactory.createFromBlueprint(c));
        entity.components.forEach(c => c.parent = entity);
        entity.components.forEach(c => c.initialize(this, template, blueprintAsset));
        this.modules.forEach(module => module.entityCreated(entity));
        entity.components.forEach(c => c.awake(this));
        return entity;
    }
    createEntitytFromTiledTemplate(parent, template) {
        if (template.object?.properties == undefined) {
            console.error("Can't create entity from template without a blueprint.");
            return null;
        }
        let blueprintProperty = template.object.properties.find(p => p.name == 'blueprint');
        if (blueprintProperty?.value == undefined) {
            console.error("Can't create entity from template without a blueprint.");
            return null;
        }
        let blueprint = this.getAsset(blueprintProperty.value);
        if (blueprint == undefined) {
            console.error(`Could not find prototype ${blueprintProperty.value}.`);
            return null;
        }
        let r = this.createEntityFromBlueprint(parent, blueprint, template);
        if (template.object.name != undefined && template.object.name !== null && template.object.name != "")
            r.name = template.object.name;
        return r;
    }
    createEntityFromTiledObject(parent, object) {
        if (object.templateAsset == undefined)
            return null;
        let r = this.createEntitytFromTiledTemplate(parent, object.templateAsset.asset);
        if (r != null) {
            r.localPosition = new Point(object);
            r.localPosition = new Point(r.localPosition.x + r.pivot.x, r.localPosition.y - r.size.y + r.pivot.y);
            if (object.name !== undefined && object.name != "")
                r.name = object.name;
        }
        return r;
    }
    createEntitiesFromTiledLayer(layer) {
        let r = [];
        if (layer.objects)
            for (let definition of layer.objects)
                if (definition.template != null && definition.template != "") {
                    let newEntity = this.createEntityFromTiledObject(this.sceneRoot, definition);
                    if (newEntity)
                        r.push(newEntity);
                }
        return r;
    }
    createTilemapFromTiledTilemap(path, pixelOffset) {
        let tilemap = this.getAsset(path).asset;
        let r = [];
        if (tilemap.layers)
            for (let layer of tilemap.layers) {
                if (layer.type == "objectgroup") {
                    r.push(...this.createEntitiesFromTiledLayer(layer));
                }
                else if (layer.type == "tilelayer") {
                    let blueprint = new EntityBlueprint();
                    let assetReference = new AssetReference("", blueprint);
                    blueprint.components.push({ type: "Tilemap", tilemap: tilemap, layer: layer });
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
    getModule(t) {
        return this.modules.find((module) => module instanceof t);
    }
}
//# sourceMappingURL=Engine.js.map