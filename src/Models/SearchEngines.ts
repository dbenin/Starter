///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export enum ResultStatus
    {
        SUCCESS = 0,
        ERROR = 1
    }

    export interface IResult//tipo risultato restituito dal motore, da implementare specificamente per ogni motore
    {
        status: ResultStatus;
        content: any//
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
        getResult(picture: string, set?: number): any;//ng.IPromise<IResult>;//torna un risultato, da definire risultato generico e specifico per ogni motore
    }

    export abstract class SearchEngine implements ISearchEngine
    {
        abstract search(picture: string, set?: number): ng.IPromise<any>;//usato dal metodo pubblico getResult
        abstract getResult(picture: string, set: number): any;//ng.IPromise<IResult>;
        constructor(public name: string, public key: string, public sets: Array<ISearchEngineSet>) { }
    }
}
