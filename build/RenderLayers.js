export var RenderLayers;
(function (RenderLayers) {
    RenderLayers[RenderLayers["BackgroundDiffuse"] = 0] = "BackgroundDiffuse";
    RenderLayers[RenderLayers["ObjectsDiffuse"] = 1] = "ObjectsDiffuse";
    RenderLayers[RenderLayers["Collision"] = 3] = "Collision";
    RenderLayers[RenderLayers["GUI"] = 4] = "GUI";
})(RenderLayers || (RenderLayers = {}));
;
export const RenderLayersMapping = {
    "BackgroundDiffuse": RenderLayers.BackgroundDiffuse,
    "ObjectsDiffuse": RenderLayers.ObjectsDiffuse,
    "Collision": RenderLayers.Collision,
    "GUI": RenderLayers.GUI
};
//# sourceMappingURL=RenderLayers.js.map