///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export interface ILoader
    {
        getEngines(): Array<Models.ISearchEngine>;
        getActive(): Models.IActiveSearchEngine;
        getActiveOptions(): CameraOptions;
        setActive(engineIndex: number, setIndex: number): void;
    }

    export class Loader implements ILoader
    {
        static $inject = ["$q", "$http", "$interval"];

        engines: Array<Models.ISearchEngine>;
        activeNames: Models.IActiveSearchEngine;
        active: Models.ISearchEngine;

        constructor(private $q: ng.IQService, private $http: ng.IHttpService, private $interval: ng.IIntervalService)
        {
            //console.log("CONSTRUCTOR");
            this.engines = [
                new Models.CloudSight("CloudSight Q-mo9tM_bf4fGlaJaAoZ8g", this.$q, this.$http, this.$interval),
                new Models.Imagga("Basic YWNjX2YzMDMyOTkxNzUwODY1Mzo5N2U0YmI4ZjYxMDBlMjc2M2M4ZjNhOTg3YWM2ZDk0Zg==", this.$q, this.$http),
                new Models.GoogleCloudVision("AIzaSyA3CSP33Kkj0FN1ypV7UeS_BhEcQjqLzsI", this.$http),
                new Models.MetaMind("Basic T2e0GexSpnGDPmxU4xj6kktMx89yl3aGxSGOd9jljRTe19xFYW", this.$http),
                new Models.JustVisual("8b502b94-24f6-4b97-b33e-a78ad605da31", this.$q)
            ];
            let engineIndex: number = parseInt(window.localStorage['lastActiveEngineIndex']) || 0;
            let setIndex: number = parseInt(window.localStorage['lastActiveSetIndex']) || 0;
            this.activeNames = { engine: this.engines[engineIndex].name, set: this.engines[engineIndex].sets[setIndex].name };
            this.active = this.engines[engineIndex];
        }

        getEngines()
        {
            return this.engines;
        }

        getActive()
        {
            return this.activeNames;
        }

        getActiveOptions()
        {
            return this.active.options;
        }

        setActive(engineIndex, setIndex)
        {
            this.active = this.engines[engineIndex];
            this.activeNames.engine = this.engines[engineIndex].name;
            this.activeNames.set = this.engines[engineIndex].sets[setIndex].name;
            window.localStorage["lastActiveEngineIndex"] = engineIndex;
            window.localStorage["lastActiveSetIndex"] = setIndex;
        }
    }
}
