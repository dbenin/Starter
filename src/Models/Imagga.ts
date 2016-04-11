﻿///<reference path="../../typings/tsd.d.ts"/>

module VisualSearch.Models
{
    export class Imagga extends SearchEngine
    {
        private $q: ng.IQService;
        private $http: ng.IHttpService;
        constructor(key: string, q: ng.IQService, http: ng.IHttpService)
        {
            let sets: Array<ISearchEngineSet> = [{ name: "Tagging", value: "tagging" }];
            super("Imagga", key, sets);
            this.$q = q;
            this.$http = http;
        }
        search(picture: string, set: number): ng.IPromise<any>
        {
            console.log("imagga " + picture);//formato picture dev'essere file uri senza ?... nel nome
            let q: ng.IDeferred<any> = this.$q.defer();

            let successCallback: (result: FileUploadResult) => void = (result: FileUploadResult) =>
            {
                let res: any = JSON.parse(result.response);
                if (res.status === "success")
                {
                    let id: string = res.uploaded[0].id;
                    console.log("id " + id);
                    this.$http.defaults.headers.common.Authorization = this.key;
                    this.$http({
                        method: "GET",
                        url: "https://api.imagga.com/v1/" + this.sets[set].value + "?content=" + id
                    }).then((promiseValue: ng.IHttpPromiseCallbackArg<any>) =>
                    {
                        q.resolve(promiseValue);
                    }, (reason: any) =>
                        {
                            q.reject(reason);
                        });
                }
                else
                {
                    q.reject(result);
                }
            };

            let errorCallback: (error: FileTransferError) => void = (error: FileTransferError) => { q.reject(error); };

            let options: FileUploadOptions = {
                fileKey: "file",
                fileName: picture.substr(picture.lastIndexOf('/') + 1),
                mimeType: "image/jpeg",
                httpMethod: "POST",
                headers: [{ "Authorization": this.key }]
            };

            let fileTransfer: FileTransfer = new FileTransfer();
            fileTransfer.upload(picture, "https://api.imagga.com/v1/content", successCallback, errorCallback, options, true);

            return q.promise;
        }
        getResult(picture: string, set: number): IResult
        {
            let result: IResult;
            result.status = ResultStatus.SUCCESS;
            return result;
        }
    }
}
