///<reference path="../../typings/tsd.d.ts"/>
///<reference path="../references.ts"/>
/**
 * Definizione del modulo Angular principale "VisualSearch" con dipendenza "ionic" e ne vengono associati tutti i
 * componenti dell'applicazione (controller, servizi e direttive) con i relativi nomi e classi in cui sono definiti.
 */
module VisualSearch.App
{
    angular.module("VisualSearch", ["ionic"])
        .controller("Main", Controllers.Main)
        .controller("About", Controllers.About)
        .controller("Settings", Controllers.Settings)
        .service("Picture", Services.Picture)
        .service("Layout", Services.Layout)
        .service("Loader", Services.Loader)
        .directive("vsSideMenu", Directives.SideMenu)
        .directive("vsHeader", Directives.Header)
        .directive("vsFooter", Directives.Footer)
        .directive("vsInfo", Directives.Info)
        .directive("vsResults", Directives.Results);
}
