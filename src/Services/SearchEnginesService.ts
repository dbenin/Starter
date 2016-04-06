///<reference path="../../typings/tsd.d.ts"/>

module SearchEngines
{
    export interface ILoader
    {
        get(): Array<ISearchEngine>;

    }

    export interface ISearchEngine
    {
        name: string;
        key: string;
        sets: Array<ISearchEngineSet>;
    }

    export interface ISearchEngineSet
    {
        name: string;
        value: any;
    }

    export class Loader implements ILoader
    {
        data: Array<ISearchEngine>;

        constructor()
        {
            this.data = [
                {
                    name: "CloudSight", key: "Q-mo9tM_bf4fGlaJaAoZ8g", sets: [
                        { name: "Product", value: "" }
                    ]
                },
                {
                    name: "Imagga", key: "Basic YWNjX2YzMDMyOTkxNzUwODY1Mzo5N2U0YmI4ZjYxMDBlMjc2M2M4ZjNhOTg3YWM2ZDk0Zg==", sets: [
                        { name: "Tagging", value: "tagging" }
                    ]
                },
                {
                    name: "GoogleCloudVision", key: "AIzaSyA3CSP33Kkj0FN1ypV7UeS_BhEcQjqLzsI", sets: [
                        { name: "Label Detection", value: "LABEL_DETECTION" },
                        { name: "Landmark Detection", value: "LANDMARK_DETECTION" },
                        { name: "Logo Detection", value: "LOGO_DETECTION" },
                        { name: "Text Detection", value: "TEXT_DETECTION" }
                    ]
                },
                {
                    name: "MetaMind", key: "T2e0GexSpnGDPmxU4xj6kktMx89yl3aGxSGOd9jljRTe19xFYW", sets: [
                        { name: "General Classifier", value: "imagenet-1k-net" },
                        { name: "Food Classifier", value: "food-net" },
                        { name: "Custom Classifier", value: 41291 }
                    ]
                },
                {
                    name: "JustVisual", key: "8b502b94-24f6-4b97-b33e-a78ad605da31", sets: [
                        { name: "Fashion", value: "http://style.vsapi01.com" },
                        { name: "Flowers & Plants", value: "http://garden.vsapi01.com" },
                        { name: "Furniture", value: "http://decor.vsapi01.com" },
                        { name: "Pet", value: "http://pets.vsapi01.com" }
                    ]
                }
            ];
        }

        get()
        {
            return this.data;
        }
    }
}

angular.module("VisualSearch").service("Loader", SearchEngines.Loader);
