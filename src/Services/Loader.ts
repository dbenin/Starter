///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Services
{
    export class Loader
    {
        static $inject = ["$q", "$http", "$interval", "Layout"];
        
        first: boolean;
        engines: Array<Models.ISearchEngine>;
        active: Models.IActiveSearchEngine;
        database: Models.Database;
        //translator: Models.Translator;

        constructor(
            private $q: ng.IQService,
            private $http: ng.IHttpService,
            private $interval: ng.IIntervalService,
            private Layout: Services.Layout
        )
        {
            Models.Database.set(this.$q, this.$http, this.Layout);
            this.database = Models.Database;
            Models.Translator.set(this.$q, this.$http, this.Layout);
            //this.translator = Models.Translator;
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
            this.first = window.localStorage["First"] || true;
            if (this.first)
            {
                window.localStorage["First"] = false;
            }
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
