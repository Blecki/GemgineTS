import { AssetLoader } from "./AssetLoader.js";
import { AssetStore } from "./AssetStore.js";
import { Fluent, type FluentElement } from "./Fluent.js";
import { loadJSON } from "./JsonLoader.js";
import { type EditorDiscApi } from "./EditorDiscApi.js";
import { Project } from "./Project.js";

export class Editor {
  public name: string = "Editor";
  
  public render() : FluentElement {
    return Fluent.div()._append("Document Editor");
  }
}
