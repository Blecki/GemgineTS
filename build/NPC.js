import { ImageAsset } from "./ImageAsset.js";
import { initializeFromJSON } from "./JsonConverter.js";
export class NPCAsset {
    gfx = undefined;
    resolveDependencies(reference, engine) {
        if (this.gfx != undefined) {
            if (typeof this.gfx === "string")
                this.gfx = engine.getAsset(this.gfx).asset;
            else {
                this.gfx = initializeFromJSON(this.gfx, new ImageAsset());
                this.gfx?.resolveDependencies(reference, engine);
            }
        }
    }
}
//# sourceMappingURL=NPC.js.map