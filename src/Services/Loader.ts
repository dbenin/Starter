///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    /*export interface ILoader
    {
        //getEngines(): Array<Models.ISearchEngine>;
        //getActive(): Models.IActiveNames;
        //getActiveOptions(): CameraOptions;
        setActive(engineIndex: number, setIndex: number): void;
        getResults(picture: string): ng.IPromise<Models.IResult>;
    }*/

    export class Loader// implements ILoader
    {
        static $inject = ["$q", "$http", "$interval", "Layout"];

        engines: Array<Models.ISearchEngine>;
        active: Models.IActiveSearchEngine;

        constructor(
            private $q: ng.IQService,
            private $http: ng.IHttpService,
            private $interval: ng.IIntervalService,
            private Layout: Services.Layout
        )
        {
            Models.Database.set(this.$q, this.$http, this.Layout);
            this.engines = [
                new Models.CloudSight(this.$q, this.$http, this.$interval),
                new Models.Imagga(this.$q, this.$http),
                new Models.GoogleCloudVision(this.$q, this.$http),
                new Models.MetaMind(this.$q, this.$http),
                new Models.JustVisual(this.$q)
            ];
            let engineIndex: number = parseInt(window.localStorage["lastActiveEngineIndex"]) || 0;
            let setIndex: number = parseInt(window.localStorage["lastActiveSetIndex"]) || 0;
            this.active = {
                names: { engine: this.engines[engineIndex].name, set: this.engines[engineIndex].sets[setIndex].name },
                indexes: { engine: engineIndex, set: setIndex },
                engine: this.engines[engineIndex]
            };
            //console.log("SET: "+ this.active.indexes.set);
        }

        /*getEngines(): Array<Models.ISearchEngine>
        {
            return this.engines;
        }*/

        /*getActive(): Models.IActiveNames
        {
            return this.active.names;
        }*/

        /*getActiveOptions(): CameraOptions
        {
            return this.active.engine.options;
        }*/

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
