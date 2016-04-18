///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Directives
{
    export function MainPage(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/main-page.html"
        };
    }
}
