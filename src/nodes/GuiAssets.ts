import { AssetStore } from "../AssetStore.js";

export class GuiAssets {
  public saveIcon: ImageBitmap | null = null;
  public loadIcon: ImageBitmap | null = null;
  public zoomInIcon: ImageBitmap | null = null;
  public zoomOutIcon: ImageBitmap | null = null;
  public refreshIcon: ImageBitmap | null = null;
  public alertIcon: ImageBitmap | null = null;

  constructor(assetStore: AssetStore) {
    assetStore.loadAsset("/assets/save.png").then(reference => { this.saveIcon = reference.asset as ImageBitmap; });
    assetStore.loadAsset("/assets/load.png").then(reference => { this.loadIcon = reference.asset as ImageBitmap; });
    assetStore.loadAsset("/assets/zoom-in.png").then(reference => { this.zoomInIcon = reference.asset as ImageBitmap; });
    assetStore.loadAsset("/assets/zoom-out.png").then(reference => { this.zoomOutIcon = reference.asset as ImageBitmap; });
    assetStore.loadAsset("/assets/refresh.png").then(reference => { this.refreshIcon = reference.asset as ImageBitmap; });
    assetStore.loadAsset("/assets/alert.png").then(reference => { this.alertIcon = reference.asset as ImageBitmap; });
  }
}