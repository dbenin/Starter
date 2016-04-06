///<reference path="../../typings/tsd.d.ts"/>

class MyController
{
    static $inject = ["Data"];
    data: Array<Services.IDataObject>;

    constructor(public Data: Services.IDataService)
    {
        this.data = Data.all();
    }
}

angular.module("VisualSearch").controller("MyController", MyController);
