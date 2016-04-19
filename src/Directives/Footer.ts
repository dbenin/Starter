///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Directives
{
    export function Footer(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/footer.html"
        };
    }
}
