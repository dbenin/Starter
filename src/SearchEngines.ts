///<reference path="../typings/tsd.d.ts"/>

interface ISearchEngineSet
{
    name: string;
    value?: string;
}

interface ISearchEngine
{
    name: string;
    key: string;
    sets: Array<ISearchEngineSet>;
    options?: CameraOptions;
    //search(picture: string): ng.IPromise<any>;
}

abstract class SearchEngine implements ISearchEngine
{
    constructor(public name: string, public key: string, public sets: Array<ISearchEngineSet>) { }
}

class CloudSight extends SearchEngine
{
    constructor(key: string)
    {
        let sets: Array<ISearchEngineSet> = [{ name: "Product" }];
        super("CloudSight", key, sets);
    }
}

class Imagga extends SearchEngine
{
    constructor(key: string)
    {
        let sets: Array<ISearchEngineSet> = [{ name: "Tagging", value: "tagging" }];
        super("Imagga", key, sets);
    }
}

class GoogleCloudVision extends SearchEngine
{
    options: CameraOptions;
    constructor(key: string)
    {
        let sets: Array<ISearchEngineSet> = [
            { name: "Label Detection", value: "LABEL_DETECTION" },
            { name: "Landmark Detection", value: "LANDMARK_DETECTION" },
            { name: "Logo Detection", value: "LOGO_DETECTION" },
            { name: "Text Detection", value: "TEXT_DETECTION" }
        ];
        super("GoogleCloudVision", key, sets);
        this.options = { destinationType: 0 };//Camera.DestinationType.DATA_URL//Camera is not defined?
    }
}

class MetaMind extends SearchEngine
{
    options: CameraOptions;
    constructor(key: string)
    {
        let sets: Array<ISearchEngineSet> = [
            { name: "General Classifier", value: "imagenet-1k-net" },
            { name: "Food Classifier", value: "food-net" },
            { name: "Custom Classifier", value: "41291" }
        ];
        super("MetaMind", key, sets);
        this.options = { destinationType: 0 };//Camera.DestinationType.DATA_URL//Camera is not defined?
    }
}

class JustVisual extends SearchEngine
{
    constructor(key: string)
    {
        let sets: Array<ISearchEngineSet> = [
            { name: "Fashion", value: "http://style.vsapi01.com" },
            { name: "Flowers & Plants", value: "http://garden.vsapi01.com" },
            { name: "Furniture", value: "http://decor.vsapi01.com" },
            { name: "Pet", value: "http://pets.vsapi01.com" }
        ];
        super("JustVisual", key, sets);
    }
}
