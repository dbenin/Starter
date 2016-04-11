///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Controllers
{
    export class Layout
    {
        static $inject = ["SideMenu"];

        constructor(private SideMenu: Services.ISideMenu) { }

        toggleSideMenu()
        {
            this.SideMenu.toggle();
        }
    }
}
