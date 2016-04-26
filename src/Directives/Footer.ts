///<reference path="../../typings/tsd.d.ts"/>

/**
 * Modulo VisualSearch.Directives in cui sono definite le direttive dell'applicazione
 */
module VisualSearch.Directives
{
    /**
     * Definizione della direttiva "vsFooter" che implementa il template del footer nella view
     */
    export function Footer(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/footer.html"
        };
    }
}
