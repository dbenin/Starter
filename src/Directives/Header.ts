///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Directives
{
    export function Header(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/header.html"
        };
    }
}
