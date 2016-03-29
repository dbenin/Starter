///<reference path="../typings/tsd.d.ts"/>

class MyController
{
    data: any;

    constructor()
    {
        this.data = "Hello World!";
    }
}

angular.module("starter").controller("MyController", MyController);
