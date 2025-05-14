export class AssetReference {
    path;
    asset;
    constructor(path, asset) {
        this.path = path;
        this.asset = asset;
    }
    Directory() {
        const separator = this.path.lastIndexOf('/');
        if (separator === -1) {
            return "";
        }
        return this.path.substring(0, separator + 1);
    }
    ResolveDependencies(engine) {
        if (this.asset !== null && this.asset !== undefined && typeof (this.asset.ResolveDependencies) === 'function')
            this.asset.ResolveDependencies(this, engine);
    }
}
//# sourceMappingURL=AssetReference.js.map