///<reference path="../typings/tsd.d.ts"/>

class MyController
{
    static $inject = ["Data"];
    data: Array<Services.IDataObject>;

    constructor(Data: Services.IDataService)
    {
        this.data = Data.all();
    }
}

angular.module("Starter").controller("MyController", MyController);
