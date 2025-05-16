import pathCombine from "./PathCombine.js";
export class Animation {
    type;
    spriteSheetPath;
    spriteSheetAsset;
    spriteWidth;
    spriteHeight;
    frames;
    frametime = 10;
    resolveDependencies(self, engine) {
        if (this.type == "spritesheet")
            this.spriteSheetAsset = engine.assetMap.get(pathCombine(self.directory(), this.spriteSheetPath)).asset;
    }
}
//# sourceMappingURL=Animation.js.map