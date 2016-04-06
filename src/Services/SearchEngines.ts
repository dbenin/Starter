///<reference path="../../typings/tsd.d.ts"/>

module SearchEngines
{
    export interface ILoader
    {
        all(): Array<ISearchEngine>;
        add(): void;
    }

    export interface ISearchEngine
    {
        id: number;
        name: string;
    }

    export class Loader implements ILoader
    {
        data: Array<ISearchEngine>;

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
            let d: ISearchEngine = { id: this.data.length, name: "data" + this.data.length };
            this.data.push(d);
        }
    }
}

angular.module("VisualSearch").service("Data", SearchEngines.Loader);
