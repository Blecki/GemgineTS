export class AssetReference {
    path;
    asset;
    loaded;
    constructor(path) {
        this.loaded = false;
        this.path = path;
    }
}
function getFileExtension(filename) {
    const match = filename.match(/\.([0-9a-z]+)(?:[\?#]|$)/i);
    return match ? match[1] : '';
}
function getLoaderPromise(Reference) {
    var extension = getFileExtension(Reference.path);
    if (extension == "png")
        return new Promise(async (resolve, reject) => {
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
        return new Promise(async (resolve, reject) => {
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
    return new Promise(async (resolve, reject) => { resolve(Reference); });
}
export function LoadAssets(assetList, onComplete) {
    loadAssets(assetList)
        .then(assets => {
        console.log("All assets loaded successfully:", assets);
        onComplete(assets);
    })
        .catch(error => {
        console.error("Asset loading failed:", error);
    });
}
async function loadAssets(assetUrls) {
    const promises = assetUrls.map(url => getLoaderPromise(url));
    try {
        const loadedAssets = await Promise.all(promises);
        return loadedAssets;
    }
    catch (error) {
        console.error("Error loading assets:", error);
        throw error;
    }
}
//# sourceMappingURL=AssetLoader.js.map