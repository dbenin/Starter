///<reference path="../../typings/tsd.d.ts"/>

/**
 * Modulo VisualSearch.Directives in cui sono definite le direttive dell'applicazione
 */
module VisualSearch.Directives
{
    /**
     * Definizione della direttiva "vsResults" che implementa il template dei risultati nella view
     */
    export function Results(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/results.html"
        };
    }
}
