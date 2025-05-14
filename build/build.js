define("AllocateEntityID", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AllocateEntityID = AllocateEntityID;
    let nextEntityID = 1;
    function AllocateEntityID() {
        let r = nextEntityID;
        nextEntityID += 1;
        return r;
    }
});
define("Point", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Point = void 0;
    class Point {
        x;
        y;
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }
        Add(other) {
            return new Point(this.x + other.x, this.y + other.y);
        }
    }
    exports.Point = Point;
});
define("Transform", ["require", "exports", "Point"], function (require, exports, Point_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Transform = void 0;
    class Transform {
        position = new Point_js_1.Point(0, 0);
    }
    exports.Transform = Transform;
});
define("EntityPrototype", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.EntityPrototype = void 0;
    class EntityPrototype {
        components = [];
    }
    exports.EntityPrototype = EntityPrototype;
});
define("AssetManagement/AssetReference", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssetReference = void 0;
    class AssetReference {
        path;
        asset;
        constructor(path, asset) {
            this.path = path;
            this.asset = asset;
        }
        Directory() {
            const separator = this.path.lastIndexOf('/');
            if (separator === -1) {
                return "";
            }
            return this.path.substring(0, separator + 1);
        }
        ResolveDependencies(engine) {
            if (this.asset !== null && this.asset !== undefined && typeof (this.asset.ResolveDependencies) === 'function')
                this.asset.ResolveDependencies(this, engine);
        }
    }
    exports.AssetReference = AssetReference;
});
define("Rect", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Rect = void 0;
    class Rect {
        x;
        y;
        width;
        height;
        constructor(x, y, width, height) {
            this.x = x;
            this.y = y;
            this.width = width;
            this.height = height;
        }
    }
    exports.Rect = Rect;
});
define("Sprite", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Sprite = void 0;
    class Sprite {
        asset;
        sourceRect;
        constructor(asset, sourceRect) {
            this.asset = asset;
            this.sourceRect = sourceRect;
        }
    }
    exports.Sprite = Sprite;
});
define("RenderingContext", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RenderingContext = void 0;
    class RenderingContext {
        canvas;
        context;
        constructor(canvas, context) {
            this.canvas = canvas;
            this.context = context;
        }
        DrawSprite(sprite, position) {
            this.context.drawImage(sprite.asset.asset, sprite.sourceRect.x, sprite.sourceRect.y, sprite.sourceRect.width, sprite.sourceRect.height, position.x, position.y, sprite.sourceRect.width, sprite.sourceRect.height);
        }
        DrawSpriteFromSourceRect(image, rect, position) {
            this.context.drawImage(image, rect.x, rect.y, rect.width, rect.height, position.x, position.y, rect.width, rect.height);
        }
        ClearScreen() {
            this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }
    exports.RenderingContext = RenderingContext;
});
define("Module", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Module = void 0;
    class Module {
        ComponentCreated(component) { }
        Update() { }
        Render(context) { }
    }
    exports.Module = Module;
});
define("Entity", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Entity = void 0;
    class Entity {
        transform;
        components = [];
    }
    exports.Entity = Entity;
});
define("Engine", ["require", "exports", "Entity", "Transform"], function (require, exports, Entity_js_1, Transform_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Engine = void 0;
    class Engine {
        modules = [];
        AssetMap;
        constructor(AssetMap) {
            this.AssetMap = AssetMap;
            for (const [key, value] of AssetMap) {
                value.ResolveDependencies(this);
            }
        }
        Update() {
            for (var module of this.modules)
                module.Update();
        }
        Render(context) {
            for (var module of this.modules)
                module.Render(context);
        }
        Run(context) {
            this.Update();
            context.ClearScreen();
            this.Render(context);
            requestAnimationFrame(() => this.Run(context));
        }
        AddModule(newModule) {
            this.modules.push(newModule);
        }
        CreateEntity(prototype) {
            let result = new Entity_js_1.Entity();
            result.transform = new Transform_js_1.Transform();
            prototype.components.forEach(component => {
                let newComponent = component.Clone();
                newComponent.transform = result.transform;
                newComponent.engine = this;
                result.components.push(newComponent);
            });
            result.components.forEach(component => component.OnSpawn());
            this.modules.forEach(module => {
                result.components.forEach(component => {
                    module.ComponentCreated(component);
                });
            });
            return result;
        }
    }
    exports.Engine = Engine;
});
define("Component", ["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Component = void 0;
    class Component {
        engine;
        transform;
        Clone() { return new Component(); }
        OnSpawn() { }
    }
    exports.Component = Component;
});
define("AssetManagement/PngLoader", ["require", "exports", "AssetManagement/AssetReference"], function (require, exports, AssetReference_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoadPNG = LoadPNG;
    function LoadPNG(basePath, path) {
        return new Promise(async (resolve, reject) => {
            const img = new Image();
            img.onload = async () => {
                resolve(new AssetReference_js_1.AssetReference(path, await window.createImageBitmap(img)));
            };
            img.onerror = () => {
                reject(new Error(`Failed to load image at ${path}`));
            };
            img.src = basePath + path;
        });
    }
});
define("AssetManagement/JsonLoader", ["require", "exports", "AssetManagement/AssetReference"], function (require, exports, AssetReference_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.LoadJSON = LoadJSON;
    function LoadJSON(basePath, path) {
        return new Promise(async (resolve, reject) => {
            const response = await fetch(basePath + path);
            if (!response.ok) {
                reject(new Error(`Failed to load JSON at ${path}`));
                return;
            }
            resolve(new AssetReference_js_2.AssetReference(path, await response.json()));
        });
    }
});
define("AssetManagement/AssetLoader", ["require", "exports", "AssetManagement/AssetReference", "AssetManagement/PngLoader", "AssetManagement/JsonLoader"], function (require, exports, AssetReference_js_3, PngLoader_js_1, JsonLoader_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.AssetLoader = void 0;
    class AssetLoader {
        loaders = new Map([
            ["png", PngLoader_js_1.LoadPNG],
            ["json", JsonLoader_js_1.LoadJSON]
        ]);
        AddLoader(extension, loader) {
            this.loaders.set(extension, loader);
        }
        getFileExtension(filename) {
            const match = filename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
            return match ? match[1] : '';
        }
        getLoaderPromise(basePath, path) {
            var extension = this.getFileExtension(path);
            if (this.loaders.has(extension))
                return this.loaders.get(extension)(basePath, path);
            else {
                console.error(`Unknown asset type: ${extension}`);
                return new Promise(async (resolve, reject) => { resolve(new AssetReference_js_3.AssetReference(path, null)); });
            }
        }
        async loadAssets(baseUrl, assetUrls) {
            const promises = assetUrls.map(url => this.getLoaderPromise(baseUrl, url));
            try {
                const loadedAssets = await Promise.all(promises);
                return loadedAssets;
            }
            catch (error) {
                console.error("Error loading assets:", error);
                throw error;
            }
        }
        LoadAssets(baseUrl, assetList, onComplete) {
            this.loadAssets(baseUrl, assetList)
                .then(assets => {
                console.log("All assets loaded successfully:", assets);
                let assetMap = new Map();
                assets.forEach(a => assetMap.set(a.path, a));
                onComplete(assetMap);
            })
                .catch(error => {
                console.error("Asset loading failed:", error);
            });
        }
    }
    exports.AssetLoader = AssetLoader;
});
define("RenderModule", ["require", "exports", "Component", "Module"], function (require, exports, Component_js_1, Module_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.RenderModule = exports.RenderComponent = void 0;
    class RenderComponent extends Component_js_1.Component {
        render(context) { }
    }
    exports.RenderComponent = RenderComponent;
    class RenderModule extends Module_js_1.Module {
        renderables = [];
        ComponentCreated(component) {
            if (component instanceof RenderComponent) {
                this.renderables.push(component);
            }
        }
        Update() {
        }
        Render(context) {
            for (var renderable of this.renderables)
                renderable.render(context);
        }
    }
    exports.RenderModule = RenderModule;
});
define("SpriteComponent", ["require", "exports", "RenderModule"], function (require, exports, RenderModule_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SpriteComponent = void 0;
    class SpriteComponent extends RenderModule_js_1.RenderComponent {
        sprite;
        constructor(sprite) {
            super();
            this.sprite = sprite;
        }
        render(context) {
            context.DrawSprite(this.sprite, this.transform.position);
        }
        Clone() {
            return new SpriteComponent(this.sprite);
        }
    }
    exports.SpriteComponent = SpriteComponent;
});
define("AssetManagement/JsonConverter", ["require", "exports", "AssetManagement/AssetReference"], function (require, exports, AssetReference_js_4) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.InitializeFromJSON = InitializeFromJSON;
    exports.LoadAndConvertJSON = LoadAndConvertJSON;
    function create(type) {
        return new type();
    }
    function InitializeFromJSON(source, destination) {
        for (var property in source)
            destination[property] = source[property];
    }
    function LoadAndConvertJSON(creationFunction) {
        return (basePath, path) => {
            return new Promise(async (resolve, reject) => {
                const response = await fetch(basePath + path);
                if (!response.ok) {
                    reject(new Error(`Failed to load JSON at ${path}`));
                    return;
                }
                var json = await response.json();
                var result = creationFunction();
                InitializeFromJSON(json, result);
                resolve(new AssetReference_js_4.AssetReference(path, result));
            });
        };
    }
});
define("TiledTileset", ["require", "exports", "Rect"], function (require, exports, Rect_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TiledTileset = void 0;
    class TiledTileset {
        columns;
        image;
        imageheight;
        imagewidth;
        margin;
        name;
        spacing;
        tilecount;
        tiledversion;
        tileheight;
        tilewidth;
        type;
        version;
        imageAsset;
        ResolveDependencies(self, engine) {
            this.imageAsset = engine.AssetMap.get(self.Directory() + this.image).asset;
        }
        GetTileRect(index) {
            return new Rect_js_1.Rect((index % this.columns) * this.tilewidth, Math.floor(index / this.columns) * this.tileheight, this.tilewidth, this.tileheight);
        }
    }
    exports.TiledTileset = TiledTileset;
});
define("TiledTilemap", ["require", "exports", "AssetManagement/JsonConverter"], function (require, exports, JsonConverter_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TiledTilemap = exports.TiledInlineTileset = exports.TiledLayer = void 0;
    class TiledLayer {
        data;
        height;
        id;
        name;
        opacity;
        type;
        visible;
        width;
        x;
        y;
    }
    exports.TiledLayer = TiledLayer;
    class TiledInlineTileset {
        firstgid;
        source;
        tilesetAsset;
        ResolveDependencies(self, engine) {
            this.tilesetAsset = engine.AssetMap.get(self.Directory() + this.source).asset;
        }
    }
    exports.TiledInlineTileset = TiledInlineTileset;
    class TiledTilemap {
        compressionlevel;
        height;
        infinite;
        layers;
        nexlayerid;
        nextobjectid;
        orientation;
        renderorder;
        tiledversion;
        tileheight;
        tilesets;
        tilewidth;
        type;
        version;
        width;
        ResolveDependencies(self, engine) {
            this.tilesets = this.tilesets.map(t => { var n = new TiledInlineTileset(); (0, JsonConverter_js_1.InitializeFromJSON)(t, n); return n; });
            this.tilesets.forEach(t => t.ResolveDependencies(self, engine));
        }
    }
    exports.TiledTilemap = TiledTilemap;
});
define("TilemapComponent", ["require", "exports", "RenderModule", "Point"], function (require, exports, RenderModule_js_2, Point_js_2) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.TilemapComponent = void 0;
    class TilemapComponent extends RenderModule_js_2.RenderComponent {
        tilemapAsset;
        tilemap;
        constructor(tilemapAsset) {
            super();
            this.tilemapAsset = tilemapAsset;
            this.tilemap = tilemapAsset.asset;
        }
        OnSpawn() {
            this.tilemap = this.tilemapAsset.asset;
        }
        render(context) {
            for (var layer of this.tilemap.layers) {
                var basePoint = this.transform.position;
                basePoint.x += layer.x;
                basePoint.y += layer.y;
                for (var x = 0; x < layer.width; ++x)
                    for (var y = 0; y < layer.height; ++y) {
                        var cellValue = layer.data[(y * layer.width) + x];
                        if (cellValue == 0)
                            continue;
                        var cellRect = this.tilemap.tilesets[0].tilesetAsset.GetTileRect(cellValue - 1);
                        var tilesetImage = this.tilemap.tilesets[0].tilesetAsset.imageAsset;
                        context.DrawSpriteFromSourceRect(tilesetImage, cellRect, basePoint.Add(new Point_js_2.Point(x * this.tilemap.tilewidth, y * this.tilemap.tileheight)));
                    }
            }
        }
        Clone() {
            return new TilemapComponent(this.tilemapAsset);
        }
    }
    exports.TilemapComponent = TilemapComponent;
});
define("Main", ["require", "exports", "AssetManagement/AssetLoader", "RenderModule", "RenderingContext", "Engine", "EntityPrototype", "AssetManagement/JsonLoader", "AssetManagement/JsonConverter", "TilemapComponent", "TiledTileset", "TiledTilemap"], function (require, exports, AssetLoader_js_1, RenderModule_js_3, RenderingContext_js_1, Engine_js_1, EntityPrototype_js_1, JsonLoader_js_2, JsonConverter_js_2, TilemapComponent_js_1, TiledTileset_js_1, TiledTilemap_js_1) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.Run = Run;
    function Run() {
        (0, JsonLoader_js_2.LoadJSON)("data/", "manifest.json")
            .then(asset => {
            let manifest = asset.asset;
            const canvas = document.getElementById('myCanvas');
            const ctx = canvas.getContext('2d');
            const loader = new AssetLoader_js_1.AssetLoader();
            loader.AddLoader("world", JsonLoader_js_2.LoadJSON);
            loader.AddLoader("tmj", (0, JsonConverter_js_2.LoadAndConvertJSON)(() => new TiledTilemap_js_1.TiledTilemap()));
            loader.AddLoader("tsj", (0, JsonConverter_js_2.LoadAndConvertJSON)(() => new TiledTileset_js_1.TiledTileset()));
            loader.LoadAssets("data/", manifest, (assets) => {
                console.log(assets);
                const engine = new Engine_js_1.Engine(assets);
                engine.AddModule(new RenderModule_js_3.RenderModule());
                var entityPrototype = new EntityPrototype_js_1.EntityPrototype();
                entityPrototype.components.push(new TilemapComponent_js_1.TilemapComponent(assets.get("assets/test-room.tmj")));
                engine.CreateEntity(entityPrototype);
                engine.Run(new RenderingContext_js_1.RenderingContext(canvas, ctx));
            });
        })
            .catch(error => console.error("Failed to load asset manifest."));
    }
});
//# sourceMappingURL=build.js.map