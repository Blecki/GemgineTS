export var RenderLayers;
(function (RenderLayers) {
    RenderLayers[RenderLayers["Ground"] = 0] = "Ground";
    RenderLayers[RenderLayers["Objects"] = 1] = "Objects";
    RenderLayers[RenderLayers["Lighting"] = 2] = "Lighting";
    RenderLayers[RenderLayers["Overlay"] = 3] = "Overlay";
    RenderLayers[RenderLayers["GUI"] = 4] = "GUI";
})(RenderLayers || (RenderLayers = {}));
;
export const RenderLayersMapping = {
    "Ground": RenderLayers.Ground,
    "Objects": RenderLayers.Objects,
    "Lighting": RenderLayers.Lighting,
    "Overlay": RenderLayers.Overlay,
    "GUI": RenderLayers.GUI
};
//# sourceMappingURL=RenderLayers.js.map