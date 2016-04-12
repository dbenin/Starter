///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export interface IResult//tipo risultato restituito dal motore, da implementare specificamente per ogni motore
    {
        ok?: boolean;
        content?: any//
    }

    export interface ISearchEngineSet
    {
        name: string;
        value: string;
    }

    export interface ISearchEngine//interfaccia per campi e metodi pubblici
    {
        name: string;
        key: string;
        sets: Array<ISearchEngineSet>;
        options?: CameraOptions;
        getResult(picture: string, set?: number): ng.IPromise<IResult>;//torna un risultato, da definire risultato generico e specifico per ogni motore
    }

    export abstract class SearchEngine implements ISearchEngine
    {
        abstract search(picture: string, set?: number): ng.IPromise<any>;//usato dal metodo pubblico getResult
        abstract getResult(picture: string, set: number): ng.IPromise<IResult>;
        constructor(
            public name: string,
            public key: string,
            public sets: Array<ISearchEngineSet>,
            protected $q: ng.IQService,
            protected $http?: ng.IHttpService,
            protected $interval?: ng.IIntervalService
        ) { }
    }
}
