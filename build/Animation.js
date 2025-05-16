import pathCombine from "./PathCombine.js";
export class Animation {
    type;
    spriteSheetPath;
    spriteSheetAsset;
    spriteWidth;
    spriteHeight;
    frames;
    frametime = 10;
    ResolveDependencies(self, engine) {
        if (this.type == "spritesheet")
            this.spriteSheetAsset = engine.AssetMap.get(pathCombine(self.Directory(), this.spriteSheetPath)).asset;
    }
}
//# sourceMappingURL=Animation.js.map