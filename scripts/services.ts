///<reference path="../typings/tsd.d.ts"/>

module Services
{
    export interface IDataService
    {
        all(): Array<IDataData>;
    }

    export interface IDataData
    {
        id: Number;
        name: String
    }

    export class Data implements IDataService
    {
        data: Array<IDataData>;

        constructor()
        {
            this.data = [
                { id: 0, name: "data0" },
                { id: 1, name: "data1" },
                { id: 2, name: "data2" }
            ];
        }

        all()
        {
            return this.data;
        }
    }
}

angular.module("starter").service("Data", Services.Data);
