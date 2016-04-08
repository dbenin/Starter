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
    //search(picture: string): ng.IPromise<any>;//usato da getResult
    //getResult(picture: string): IResult;//torna un risultato, da definire risultato generico e specifico per ogni servizio
}

abstract class SearchEngine implements ISearchEngine
{
    //abstract search(picture: string): any;
    constructor(public name: string, public key: string, public sets: Array<ISearchEngineSet>) { }
}

class CloudSight extends SearchEngine
{
    private $q: ng.IQService;
    private $http: ng.IHttpService;
    private $interval: ng.IIntervalService;
    constructor(key: string, q: ng.IQService, http: ng.IHttpService, interval: ng.IIntervalService)
    {
        let sets: Array<ISearchEngineSet> = [{ name: "Product" }];
        super("CloudSight", key, sets);
        this.$q = q;
        this.$http = http;
        this.$interval = interval;
    }
}

class Imagga extends SearchEngine
{
    private $q: ng.IQService;
    constructor(key: string, q: ng.IQService)
    {
        let sets: Array<ISearchEngineSet> = [{ name: "Tagging", value: "tagging" }];
        super("Imagga", key, sets);
        this.$q = q;
    }
}

class GoogleCloudVision extends SearchEngine
{
    private $http: ng.IHttpService;
    options: CameraOptions;
    constructor(key: string, http: ng.IHttpService)
    {
        let sets: Array<ISearchEngineSet> = [
            { name: "Label Detection", value: "LABEL_DETECTION" },
            { name: "Landmark Detection", value: "LANDMARK_DETECTION" },
            { name: "Logo Detection", value: "LOGO_DETECTION" },
            { name: "Text Detection", value: "TEXT_DETECTION" }
        ];
        super("GoogleCloudVision", key, sets);
        this.$http = http;
        this.options = { destinationType: 0 };//Camera.DestinationType.DATA_URL//Camera is not defined?
    }
}

class MetaMind extends SearchEngine
{
    private $http: ng.IHttpService;
    options: CameraOptions;
    constructor(key: string, http: ng.IHttpService)
    {
        let sets: Array<ISearchEngineSet> = [
            { name: "General Classifier", value: "imagenet-1k-net" },
            { name: "Food Classifier", value: "food-net" },
            { name: "Custom Classifier", value: "41291" }
        ];
        super("MetaMind", key, sets);
        this.$http = http;
        this.options = { destinationType: 0 };//Camera.DestinationType.DATA_URL//Camera is not defined?
    }
}

class JustVisual extends SearchEngine
{
    private $q: ng.IQService;
    constructor(key: string, q: ng.IQService)
    {
        let sets: Array<ISearchEngineSet> = [
            { name: "Fashion", value: "http://style.vsapi01.com" },
            { name: "Flowers & Plants", value: "http://garden.vsapi01.com" },
            { name: "Furniture", value: "http://decor.vsapi01.com" },
            { name: "Pet", value: "http://pets.vsapi01.com" }
        ];
        super("JustVisual", key, sets);
        this.$q = q;
    }
}
