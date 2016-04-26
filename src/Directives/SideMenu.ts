///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Directives in cui sono definite le direttive dell'applicazione
module VisualSearch.Directives
{
    // Definizione della direttiva "vsSideMenu" che implementa il template del menù laterale nella view
    export function SideMenu(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/side-menu.html"
        };
    }
}
