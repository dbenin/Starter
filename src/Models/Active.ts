///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export interface IActiveNames
    {
        engine: string;
        set: string;
    }

    export interface IActiveIndexes
    {
        engine: number;
        set: number;
    }

    export interface IActiveSearchEngine
    {
        names: IActiveNames;
        indexes: IActiveIndexes;
        engine: ISearchEngine;
    }
}
