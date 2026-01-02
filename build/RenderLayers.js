export var RenderLayers;
(function (RenderLayers) {
    RenderLayers[RenderLayers["Background"] = 0] = "Background";
    RenderLayers[RenderLayers["Objects"] = 1] = "Objects";
})(RenderLayers || (RenderLayers = {}));
;
export const RenderLayersMapping = {
    "Background": RenderLayers.Background,
    "Objects": RenderLayers.Objects
};
export var RenderChannels;
(function (RenderChannels) {
    RenderChannels[RenderChannels["Diffuse"] = 0] = "Diffuse";
    RenderChannels[RenderChannels["Normals"] = 1] = "Normals";
    RenderChannels[RenderChannels["Collision"] = 2] = "Collision";
})(RenderChannels || (RenderChannels = {}));
;
export const RenderChannelsMapping = {
    "Diffuse": RenderChannels.Diffuse,
    "Normals": RenderChannels.Normals,
    "Collision": RenderChannels.Collision
};
//# sourceMappingURL=RenderLayers.js.map