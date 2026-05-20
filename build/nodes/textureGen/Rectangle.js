import { Vector3Raw } from "../../gl/Vector3.js";
import { Rect } from "../../Rect.js";
import { Node } from "../Node.js";
import { EditorContext } from "../../editor/EditorContext.js";
import { NodeSet } from "../NodeSet.js";
import { RenderTarget2D } from "../../RenderTarget2D.js";
import { InputTerminal } from "../InputTerminal.js";
import { NodeSetting } from "../NodeSetting.js";
import { AssetStore } from "../../AssetStore.js";
export class Rectangle extends Node {
    settingRect;
    outputRect;
    constructor(assetStore) {
        super("RECT", "rect", assetStore);
        this.settingRect = this.AddSetting("rect", "rect", new Rect(32, 32, 32, 32), assetStore);
        this.outputRect = this.AddOutput("rect", "rect");
        this.updateHeight();
    }
    Process() {
        this.outputRect.setValue(this.settingRect.getValue);
    }
}
//# sourceMappingURL=Rectangle.js.map