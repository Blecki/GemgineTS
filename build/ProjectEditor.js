import { AssetLoader } from "./AssetLoader.js";
import { AssetStore } from "./AssetStore.js";
import { Fluent } from "./Fluent.js";
import { loadJSON } from "./JsonLoader.js";
import {} from "./EditorDiscApi.js";
import { Project } from "./Project.js";
import { Editor } from "./Editor.js";
export class ProjectEditor extends Editor {
    project;
    constructor(project) {
        super();
        this.project = project;
    }
    render() {
        return Fluent.div()._append("Document Editor");
    }
}
//# sourceMappingURL=ProjectEditor.js.map