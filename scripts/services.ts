///<reference path="../typings/tsd.d.ts"/>

module Services
{
    export interface IDataService
    {
        all(): Array<IDataObject>;
        add(): void;
    }

    export interface IDataObject
    {
        id: number;
        name: string;
    }

    export class Data implements IDataService
    {
        data: Array<IDataObject>;

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

        add()
        {
            let d: IDataObject = {id: this.data.length, name: "data" + this.data.length};
            this.data.push(d);
        }
    }
}

angular.module("VisualSearch").service("Data", Services.Data);
