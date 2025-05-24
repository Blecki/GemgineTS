import pathCombine from "./PathCombine.js";
export class Animation {
    type = null;
    spriteSheetPath = null;
    spriteSheetAsset = null;
    spriteWidth = 16;
    spriteHeight = 16;
    frames = [];
    frametime = 10;
    resolveDependencies(self, engine) {
        if (this.type == "spritesheet" && this.spriteSheetPath != null) {
            let path = pathCombine(self.directory(), this.spriteSheetPath);
            let asset = engine.getAsset(path);
            if (asset != undefined)
                this.spriteSheetAsset = asset.asset;
        }
    }
}
//# sourceMappingURL=Animation.js.map