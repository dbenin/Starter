﻿///<reference path="../typings/tsd.d.ts"/>

interface IResult { }//tipo risultato restituito dal motore, da implementare specificamente per ogni motore

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
    search(picture: string): ng.IPromise<any>;//usato da getResult
    //getResult(picture: string): IResult;//torna un risultato, da definire risultato generico e specifico per ogni motore
}

abstract class SearchEngine implements ISearchEngine
{
    abstract search(picture: string): ng.IPromise<any>;
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
        super("CloudSight", key, sets);//formato key dev'essere "CloudSight asdasdasdasdasdasdasdasd"
        this.$q = q;
        this.$http = http;
        this.$interval = interval;
    }
    search(picture: string): ng.IPromise<any>
    {
        console.log("cloudsight " + picture);//formato picture dev'essere file uri senza ?... nel nome
        let q: ng.IDeferred<any> = this.$q.defer();

        let successCallback: (result: FileUploadResult) => void = (result: FileUploadResult) =>
        {
            let time: number = +new Date();
            let token: string = JSON.parse(result.response).token;
            console.log("token: " + token);
            let polling: ng.IPromise<any> = this.$interval(() =>
            {
                this.$http.defaults.headers.common.Authorization = this.key;
                this.$http({
                    method: "GET",
                    url: "https://api.cloudsightapi.com/image_responses/" + token
                }).then((promiseValue: ng.IHttpPromiseCallbackArg<any>) =>
                {
                    if (promiseValue.data.status === "not completed")
                    {
                        console.log("Not completed...");
                    }
                    else
                    {
                        promiseValue.data.time = (+new Date() - time) / 1000;//tempo trascorso, in secondi
                        q.resolve(promiseValue);
                        stop();
                    }
                }, (reason: any) =>
                {
                    q.reject(reason);
                    stop();
                });
            }, 2000);
            let stop: () => void = () => { this.$interval.cancel(polling) };
        };

        let errorCallback: (error: FileTransferError) => void = (error: FileTransferError) => { q.reject(error); };

        let options: FileUploadOptions = new FileUploadOptions();
        options.fileKey = "image_request[image]";
        options.fileName = picture.substr(picture.lastIndexOf('/') + 1);
        options.mimeType = "image/jpeg";
        options.httpMethod = "POST";
        options.params = { "image_request[locale]": "en-US" }; // if we need to send parameters to the server request
        options.headers = [{ "Authorization": this.key }];

        let ft: FileTransfer = new FileTransfer();
        ft.upload(picture, encodeURI("https://api.cloudsightapi.com/image_requests"), successCallback, errorCallback, options, true);

        return q.promise;
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
