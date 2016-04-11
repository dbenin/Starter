﻿///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class CloudSight extends SearchEngine
    {
        private $q: ng.IQService;
        private $http: ng.IHttpService;
        private $interval: ng.IIntervalService;
        constructor(key: string, q: ng.IQService, http: ng.IHttpService, interval: ng.IIntervalService)
        {
            let sets: Array<ISearchEngineSet> = [{ name: "Product", value: "" }];
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

            let options: FileUploadOptions = {
                fileKey: "image_request[image]",
                fileName: picture.substr(picture.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                httpMethod: "POST",
                params: { "image_request[locale]": "en-US" },
                headers: [{ "Authorization": this.key }]
            };

            let fileTransfer: FileTransfer = new FileTransfer();
            fileTransfer.upload(picture, "https://api.cloudsightapi.com/image_requests", successCallback, errorCallback, options, true);

            return q.promise;
        }
    }
}
