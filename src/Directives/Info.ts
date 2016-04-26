///<reference path="../../typings/tsd.d.ts"/>

// Modulo VisualSearch.Directives in cui sono definite le direttive dell'applicazione
module VisualSearch.Directives
{
    // Definizione della direttiva "vsInfo" che implementa il template delle informazioni nella view
    export function Info(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/info.html"
        };
    }
}
