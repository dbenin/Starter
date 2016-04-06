///<reference path="../../typings/tsd.d.ts"/>

class LayoutController
{
    static $inject = ["$ionicSideMenuDelegate"];

    constructor(public $ionicSideMenuDelegate: ionic.sideMenu.IonicSideMenuDelegate)
    {

    }

    toggleSideMenu()
    {
        this.$ionicSideMenuDelegate.toggleLeft();
    }
}

angular.module("VisualSearch").controller("LayoutController", LayoutController);
