///<reference path="../typings/tsd.d.ts"/>

class MyController
{
    static $inject = ["Data"];
    data: Array<Services.IDataObject>;

    constructor(public Data: Services.IDataService)
    {
        this.data = Data.all();
    }
}

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

angular.module("VisualSearch").controller("MyController", MyController);
angular.module("VisualSearch").controller("LayoutController", LayoutController);
