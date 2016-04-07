///<reference path="../../typings/tsd.d.ts"/>

module Layout
{
    export interface ISideMenu
    {
        toggle(): void;
    }

    export class SideMenu implements ISideMenu
    {
        static $inject = ["$ionicSideMenuDelegate"];

        constructor(private $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate) { }

        toggle()
        {
            this.$ionicSideMenuDelegate.toggleLeft();
        }
    }
}

//angular.module("VisualSearch").service("SideMenu", Layout.SideMenu);
