export enum RenderLayers {
    BackgroundDiffuse = 0,
    ObjectsDiffuse = 1,
    Collision = 3,
    GUI = 4
};

export const RenderLayersMapping: { [key: string]: RenderLayers } = {
    "BackgroundDiffuse": RenderLayers.BackgroundDiffuse,
    "ObjectsDiffuse":  RenderLayers.ObjectsDiffuse,
    "Collision": RenderLayers.Collision,
    "GUI": RenderLayers.GUI
};
