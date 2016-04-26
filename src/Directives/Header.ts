///<reference path="../../typings/tsd.d.ts"/>

/**
 * Modulo VisualSearch.Directives in cui sono definite le direttive dell'applicazione
 */
module VisualSearch.Directives
{
    /**
     * Definizione della direttiva "vsHeader" che implementa il template dell'header nella view
     */
    export function Header(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/header.html"
        };
    }
}
