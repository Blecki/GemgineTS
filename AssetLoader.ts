export class AssetReference {
  public path: string;
  public asset: any;
  public loaded: boolean;

  constructor(path: string) {
    this.loaded = false;
    this.path = path;
  }
}

function getFileExtension(filename: string): string {
  const match = filename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
  return match ? match[1] : '';
}

function getLoaderPromise(Reference: AssetReference): Promise<AssetReference> {
  var extension = getFileExtension(Reference.path);

  if (extension == "png") 
    return new Promise<AssetReference>(async (resolve, reject) => {
      const img = new Image();
      img.onload = async () => {
        Reference.asset = await window.createImageBitmap(img);
        Reference.loaded = true;
        resolve(Reference);
      };
      img.onerror = () => {
        reject(new Error(`Failed to load image at ${Reference.path}`));
      };
      img.src = Reference.path;
    });

  if (extension == "json") 
    return new Promise<AssetReference>(async (resolve, reject) => {
      const response = await fetch(Reference.path);
      if (!response.ok) {
        reject(new Error(`Failed to load JSON at ${Reference.path}`));
        return;
      }
      const data = await response.json();
      Reference.asset = data;
      Reference.loaded = true;
      resolve(Reference);
    });

  return new Promise(async (resolve, reject) => { resolve(Reference) });
}

export function LoadAssets(assetList: AssetReference[], onComplete: (Assets: AssetReference[]) => void) {
  loadAssets(assetList)
    .then(assets => {
      console.log("All assets loaded successfully:", assets);
      onComplete(assets);
    })
    .catch(error => {
      console.error("Asset loading failed:", error);
    });
}

async function loadAssets(assetUrls: AssetReference[]) {
  const promises = assetUrls.map(url => getLoaderPromise(url));

  try {
    const loadedAssets = await Promise.all(promises);
    return loadedAssets;
  } catch (error) {
    console.error("Error loading assets:", error);
    throw error;
  }
}

