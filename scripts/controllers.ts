///<reference path="../typings/tsd.d.ts"/>

class MyController
{
    public $inject = ["Data"];
    data: Array<Services.IDataData>;

    constructor(public Data: Services.IDataService)
    {
        this.data = Data.all();
    }
}

angular.module("starter").controller("MyController", MyController);
