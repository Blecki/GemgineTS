export enum RenderLayers {
    Background = 0,
    Objects = 1
};

export const RenderLayersMapping: { [key: string]: RenderLayers } = {
    "Background": RenderLayers.Background,
    "Objects":  RenderLayers.Objects
};

export enum RenderChannels {
    Diffuse = 0,
    Normals = 1,
    Collision = 2
};

export const RenderChannelsMapping: { [key: string]: RenderChannels } = {
    "Diffuse": RenderChannels.Diffuse,
    "Normals": RenderChannels.Normals,
    "Collision": RenderChannels.Collision
};