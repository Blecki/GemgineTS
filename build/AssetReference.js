import { Engine } from "./Engine.js";
export class AssetReference {
    path;
    asset;
    constructor(first, asset) {
        this.path = "";
        if (first === undefined)
            throw "Can't create undefined asset reference.";
        if (typeof first === 'object') {
            let p = first;
            this.path = p.path;
            this.asset = p.asset;
        }
        else if (typeof first === 'string') {
            this.path = first;
            this.asset = asset;
        }
    }
    directory() {
        const separator = this.path.lastIndexOf('/');
        if (separator === -1) {
            return "";
        }
        return this.path.substring(0, separator + 1);
    }
    resolveDependencies(engine) {
        if (this.asset !== null && this.asset !== undefined && typeof (this.asset.resolveDependencies) === 'function')
            this.asset.resolveDependencies(this, engine);
    }
}
//# sourceMappingURL=AssetReference.js.map