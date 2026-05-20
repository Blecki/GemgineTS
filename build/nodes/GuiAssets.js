import { AssetStore } from "../AssetStore.js";
export class GuiAssets {
    saveIcon = null;
    loadIcon = null;
    zoomInIcon = null;
    zoomOutIcon = null;
    refreshIcon = null;
    alertIcon = null;
    constructor(assetStore) {
        assetStore.loadAsset("/assets/save.png").then(reference => { this.saveIcon = reference.asset; });
        assetStore.loadAsset("/assets/load.png").then(reference => { this.loadIcon = reference.asset; });
        assetStore.loadAsset("/assets/zoom-in.png").then(reference => { this.zoomInIcon = reference.asset; });
        assetStore.loadAsset("/assets/zoom-out.png").then(reference => { this.zoomOutIcon = reference.asset; });
        assetStore.loadAsset("/assets/refresh.png").then(reference => { this.refreshIcon = reference.asset; });
        assetStore.loadAsset("/assets/alert.png").then(reference => { this.alertIcon = reference.asset; });
    }
}
//# sourceMappingURL=GuiAssets.js.map