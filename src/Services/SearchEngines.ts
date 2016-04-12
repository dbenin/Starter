///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export interface ILoader
    {
        getEngines(): Array<Models.ISearchEngine>;
        getActive(): Models.IActiveNames;
        getActiveOptions(): CameraOptions;
        setActive(engineIndex: number, setIndex: number): void;
        getResults(picture: string): ng.IPromise<Models.IResult>;
    }

    export class Loader implements ILoader
    {
        static $inject = ["$q", "$http", "$interval"];

        engines: Array<Models.ISearchEngine>;
        active: Models.IActiveSearchEngine;

        constructor(private $q: ng.IQService, private $http: ng.IHttpService, private $interval: ng.IIntervalService)
        {
            //console.log("CONSTRUCTOR");
            this.engines = [//caricare e salvare key in locale
                new Models.CloudSight("CloudSight Q-mo9tM_bf4fGlaJaAoZ8g", this.$q, this.$http, this.$interval),
                new Models.Imagga("Basic YWNjX2YzMDMyOTkxNzUwODY1Mzo5N2U0YmI4ZjYxMDBlMjc2M2M4ZjNhOTg3YWM2ZDk0Zg==", this.$q, this.$http),
                new Models.GoogleCloudVision("AIzaSyA3CSP33Kkj0FN1ypV7UeS_BhEcQjqLzsI", this.$q, this.$http),
                new Models.MetaMind("Basic T2e0GexSpnGDPmxU4xj6kktMx89yl3aGxSGOd9jljRTe19xFYW", this.$q, this.$http),
                new Models.JustVisual("8b502b94-24f6-4b97-b33e-a78ad605da31", this.$q)
            ];
            let engineIndex: number = parseInt(window.localStorage['lastActiveEngineIndex']) || 0;
            let setIndex: number = parseInt(window.localStorage['lastActiveSetIndex']) || 0;
            this.active = {
                names: { engine: this.engines[engineIndex].name, set: this.engines[engineIndex].sets[setIndex].name },
                indexes: { engine: engineIndex, set: setIndex },
                engine: this.engines[engineIndex]
            };
            //console.log("SET: "+ this.active.indexes.set);
        }

        getEngines(): Array<Models.ISearchEngine>
        {
            return this.engines;
        }

        getActive(): Models.IActiveNames
        {
            return this.active.names;
        }

        getActiveOptions(): CameraOptions
        {
            return this.active.engine.options;
        }

        setActive(engineIndex: number, setIndex: number): void
        {
            this.active.names.engine = this.engines[engineIndex].name;
            this.active.names.set = this.engines[engineIndex].sets[setIndex].name;
            this.active.indexes.engine = engineIndex;
            this.active.indexes.set = setIndex;
            this.active.engine = this.engines[engineIndex];
            console.log("SET: " + this.active.indexes.set);
            window.localStorage["lastActiveEngineIndex"] = engineIndex;
            window.localStorage["lastActiveSetIndex"] = setIndex;
        }

        getResults(picture: string): ng.IPromise<Models.IResult>
        {
            return this.active.engine.getResult(picture, this.active.indexes.set);
        }
    }
}
