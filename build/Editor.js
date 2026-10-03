import { AssetLoader } from "./AssetLoader.js";
import { AssetStore } from "./AssetStore.js";
import { Fluent } from "./Fluent.js";
import { loadJSON } from "./JsonLoader.js";
import {} from "./EditorDiscApi.js";
import { Project } from "./Project.js";
export class Editor {
    name = "Editor";
    render() {
        return Fluent.div()._append("Document Editor");
    }
}
//# sourceMappingURL=Editor.js.map