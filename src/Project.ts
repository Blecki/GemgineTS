type ProjectPrototype = {
  name: string;
  manifest: string[];
}

export class Project {
  name: string;
  manifest: string[];

  constructor(prototype?:object) {
    let p = prototype as ProjectPrototype;
    this.name = p?.name ?? "";
    this.manifest = p?.manifest ?? [];
  }
}