///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Directives
{
    export function Results(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/results.html"
        };
    }
}
