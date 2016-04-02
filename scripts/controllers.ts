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

class MyController2
{
    static $inject = ["Data"];
    data: Array<Services.IDataObject>;

    constructor(public Data: Services.IDataService)
    {
        this.data = Data.all();
    }

    add()
    {
        this.Data.add();
    }
}

angular.module("Starter").controller("MyController", MyController);
angular.module("Starter").controller("MyController2", MyController2);
