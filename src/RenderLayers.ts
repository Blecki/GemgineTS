export enum RenderLayers {
    Ground = 0,
    Objects = 1,
    Lighting = 2,
    Overlay = 3,
    GUI = 4
};

export const RenderLayersMapping: { [key: string]: RenderLayers } = {
    "Ground": RenderLayers.Ground,
    "Objects":  RenderLayers.Objects,
    "Lighting": RenderLayers.Lighting,
    "Overlay": RenderLayers.Overlay,
    "GUI": RenderLayers.GUI
};