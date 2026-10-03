import { AssetLoader } from "./AssetLoader.js";
import { AssetStore } from "./AssetStore.js";
import { Fluent } from "./Fluent.js";
import { loadJSON } from "./JsonLoader.js";
import {} from "./EditorDiscApi.js";
import { Editor } from "./Editor.js";
import { Project } from "./Project.js";
import { ProjectEditor } from "./ProjectEditor.js";
export class EditorHarness {
    container;
    constructor(container, disc) {
        this.container = container;
        container.innerHTML = "Hello World";
        /*
        this.container.appendChild(Fluent.button()._append("Open Project")._handler('click', () => {
          disc.ChooseFile().then(s => {
            disc.ReadFile(s).then(f => {
              var object = JSON.parse(f);
              var project = new Project(object);
              this.addEditor(new ProjectEditor(project));
            });
          });
        }));
        */
    }
    addEditor(editor) {
        var newTab = Fluent.div()._append(editor.name);
        //this.tabBar._append(newTab);
    }
}
//# sourceMappingURL=EditorHarness.js.map