export class AssetReference {
    path;
    asset;
    constructor(path, asset) {
        this.path = path;
        this.asset = asset;
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