///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../references.ts"/>

angular.module("VisualSearch", ["ionic"])
    .controller("CameraController", CameraController)
    .controller("LayoutController", LayoutController)
    .controller("SearchEnginesController", SearchEnginesController)
    .service("Picture", Services.Camera.Picture)
    .service("SideMenu", Layout.SideMenu)
    .service("Loader", SearchEngines.Loader);
