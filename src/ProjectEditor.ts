import { AssetLoader } from "./AssetLoader.js";
import { AssetStore } from "./AssetStore.js";
import { Fluent, type FluentElement } from "./Fluent.js";
import { loadJSON } from "./JsonLoader.js";
import { type EditorDiscApi } from "./EditorDiscApi.js";
import { Project } from "./Project.js";
import { Editor } from "./Editor.js";

export class ProjectEditor extends Editor {
  private project: Project;

  constructor(project: Project) {
    super();
    this.project = project;
  }

  public render() : FluentElement {
    return Fluent.div()._append("Document Editor");
  }  
}
