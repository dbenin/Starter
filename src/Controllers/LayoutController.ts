///<reference path="../../typings/tsd.d.ts"/>

class LayoutController
{
    static $inject = ["SideMenu"];

    constructor(private SideMenu: Layout.ISideMenu) { }

    toggleSideMenu()
    {
        this.SideMenu.toggle();
    }
}

//angular.module("VisualSearch").controller("LayoutController", LayoutController);
