///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../references.ts"/>

module VisualSearch.App
{
    angular.module("VisualSearch", ["ionic"])
        .controller("Main", Controllers.Main)
        .service("Picture", Services.Picture)
        .service("Layout", Services.Layout)
        .service("Loader", Services.Loader);
}
