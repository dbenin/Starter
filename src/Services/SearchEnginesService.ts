///<reference path="../../typings/tsd.d.ts"/>

module SearchEngines
{
    export interface ILoader
    {
        getEngines(): Array<ISearchEngine>;
        getActive(): IActiveSearchEngine;
        getActiveOptions(): CameraOptions;
        setActive(engineIndex: number, setIndex: number): void;
    }

    export interface ISearchEngine
    {
        name: string;
        key: string;
        sets: Array<ISearchEngineSet>;
        options?: CameraOptions;
    }

    export interface ISearchEngineSet
    {
        name: string;
        value: any;
    }

    export interface IActiveSearchEngine
    {
        engine: string;
        set: string;
    }

    export class Loader implements ILoader
    {
        engines: Array<ISearchEngine>;
        activeNames: IActiveSearchEngine;
        active: ISearchEngine;

        constructor()
        {
            console.log("CONSTRUCTOR");
            this.engines = [
                {
                    name: "CloudSight",
                    key: "Q-mo9tM_bf4fGlaJaAoZ8g",
                    sets: [
                        { name: "Product", value: "" }
                    ]
                },
                {
                    name: "Imagga",
                    key: "Basic YWNjX2YzMDMyOTkxNzUwODY1Mzo5N2U0YmI4ZjYxMDBlMjc2M2M4ZjNhOTg3YWM2ZDk0Zg==",
                    sets: [
                        { name: "Tagging", value: "tagging" }
                    ]
                },
                {
                    name: "GoogleCloudVision",
                    key: "AIzaSyA3CSP33Kkj0FN1ypV7UeS_BhEcQjqLzsI",
                    sets: [
                        { name: "Label Detection", value: "LABEL_DETECTION" },
                        { name: "Landmark Detection", value: "LANDMARK_DETECTION" },
                        { name: "Logo Detection", value: "LOGO_DETECTION" },
                        { name: "Text Detection", value: "TEXT_DETECTION" }
                    ],
                    options: {
                        destinationType: 0//Camera.DestinationType.DATA_URL//Camera is not defined?
                    }
                },
                {
                    name: "MetaMind",
                    key: "T2e0GexSpnGDPmxU4xj6kktMx89yl3aGxSGOd9jljRTe19xFYW",
                    sets: [
                        { name: "General Classifier", value: "imagenet-1k-net" },
                        { name: "Food Classifier", value: "food-net" },
                        { name: "Custom Classifier", value: 41291 }
                    ],
                    options: {
                        destinationType: 0//Camera.DestinationType.DATA_URL//Camera is not defined?
                    }
                },
                {
                    name: "JustVisual",
                    key: "8b502b94-24f6-4b97-b33e-a78ad605da31",
                    sets: [
                        { name: "Fashion", value: "http://style.vsapi01.com" },
                        { name: "Flowers & Plants", value: "http://garden.vsapi01.com" },
                        { name: "Furniture", value: "http://decor.vsapi01.com" },
                        { name: "Pet", value: "http://pets.vsapi01.com" }
                    ]
                }
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

//angular.module("VisualSearch").service("Loader", SearchEngines.Loader);
