export class Project {
    name;
    manifest;
    constructor(prototype) {
        let p = prototype;
        this.name = p?.name ?? "";
        this.manifest = p?.manifest ?? [];
    }
}
//# sourceMappingURL=Project.js.map