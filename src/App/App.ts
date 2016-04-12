///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../references.ts"/>

module VisualSearch.App
{
    angular.module("VisualSearch", ["ionic"])
        .controller("Main", Controllers.Main)
        //.controller("Picture", Controllers.Picture)
        //.controller("Layout", Controllers.Layout)
        //.controller("SearchEngines", Controllers.SearchEngines)
        .service("Picture", Services.Picture)
        .service("Layout", Services.Layout)
        .service("Loader", Services.Loader);
}
