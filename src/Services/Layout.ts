///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export interface ILayout
    {
        toggleSideMenu(): void;
    }

    export class Layout implements ILayout
    {
        static $inject = ["$ionicSideMenuDelegate"];

        constructor(private $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate) { }

        toggleSideMenu()
        {
            this.$ionicSideMenuDelegate.toggleLeft();
        }
    }
}
