import { AssetStore } from "./AssetStore.js";
import { RenderContext } from "./RenderContext.js";
import { RenderComponent } from "./RenderModule.js";
import { componentType } from "./Component.js";
import { AssetReference } from "./AssetReference.js";
import { Mesh } from "./gl/Mesh.js";
import { Material } from "./gl/Material.js";

type MeshComponentPrototype = {
  
}

@componentType("Mesh")
export class MeshComponent extends RenderComponent {
  public mesh: Mesh | null = null;
  public material: Material | null = null;

  constructor(prototype?: object) {
    super(prototype);
    
  }

  public resolveDependencies(reference: AssetReference, engine: AssetStore): void {  
  }

  public render(context: RenderContext) {

  }
}