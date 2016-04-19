///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Directives
{
    export function Info(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/info.html"
        };
    }
}
