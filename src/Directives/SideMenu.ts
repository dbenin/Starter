///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Directives
{
    export function SideMenu(): ng.IDirective
    {
        return {
            restrict: 'E',
            templateUrl: "templates/side-menu.html",
            //controller: VisualSearch.Controllers.Main,
            //controllerAs: 'ciao'
        };
    }
}
